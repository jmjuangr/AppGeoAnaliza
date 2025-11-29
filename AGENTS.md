# AGENTS.md

Instrucciones para crear una app que consuma la API de Google Maps
(centrada en el SKU **Geolocation** y en obtener puntos geolocalizados por municipio, zonas y barrios)

---

## 1. Objetivo de la app

La app debe permitir:

1. Introducir un **municipio** (por ejemplo, “Sevilla, España”).
2. Obtener un conjunto de **puntos geolocalizados** dentro de ese municipio, con al menos:

   - `lat` (latitud)
   - `lng` (longitud)
   - nombre o descripción del punto
   - información de **zona / barrio / subzona** cuando sea posible

3. Opcionalmente, obtener también la **ubicación del dispositivo** del usuario usando el SKU **Geolocation** (para centrar el mapa en su posición).

> ⚠️ Importante:
> El SKU **Geolocation** sirve para obtener la **ubicación de un dispositivo** usando antenas y Wi-Fi, **no** para listar puntos dentro de una ciudad.
> Para “Sevilla → muchos puntos con lat/lng y barrios” se necesitarán sobre todo:
>
> - **Geocoding API** (para convertir el nombre del municipio en coordenadas y límites) ([Google for Developers][1])
> - **Places API** (para buscar lugares dentro de ese municipio). ([Google Maps Platform][2])

Este archivo explica cómo combinar todo para que cualquier desarrollador o agente de IA pueda implementar la app.

---

## 2. Productos de Google Maps Platform que se usarán

### 2.1. Geolocation API (SKU: Geolocation)

**Uso principal en esta app:**

- Obtener la posición aproximada del dispositivo del usuario (lat/lng + precisión) **sin GPS**, usando redes móviles y Wi-Fi. ([Google for Developers][3])

**Endpoint básico (POST):**

```http
POST https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_API_KEY
Content-Type: application/json

{
  "considerIp": true
  // Opcional: info de torres de telefonía y puntos WiFi
}
```

**Respuesta JSON típica:**

```json
{
  "location": {
    "lat": 37.4219983,
    "lng": -122.084
  },
  "accuracy": 1200.4
}
```

- `location.lat`: latitud estimada
- `location.lng`: longitud estimada
- `accuracy`: radio (en metros) dentro del cual se espera que esté el dispositivo ([Google for Developers][4])

En la app, esta posición se puede usar para:

- Centrar el mapa
- Sugerir automáticamente un municipio cercano

---

### 2.2. Geocoding API

**Objetivo:** convertir un texto como “Sevilla, España” en coordenadas y en la “caja” del municipio (viewport). ([Google for Developers][1])

**Endpoint básico (GET):**

```http
GET https://maps.googleapis.com/maps/api/geocode/json
  ?address=Sevilla,España
  &key=YOUR_API_KEY
```

**Respuesta JSON (simplificada):**

```json
{
  "results": [
    {
      "formatted_address": "Sevilla, España",
      "geometry": {
        "location": {
          "lat": 37.3890924,
          "lng": -5.9844589
        },
        "viewport": {
          "northeast": { "lat": 37.45, "lng": -5.88 },
          "southwest": { "lat": 37.33, "lng": -6.05 }
        }
      },
      "address_components": [
        {
          "long_name": "Sevilla",
          "short_name": "Sevilla",
          "types": ["locality", "political"]
        },
        {
          "long_name": "Sevilla",
          "short_name": "SE",
          "types": ["administrative_area_level_2", "political"]
        },
        {
          "long_name": "Andalucía",
          "short_name": "AN",
          "types": ["administrative_area_level_1", "political"]
        },
        {
          "long_name": "España",
          "short_name": "ES",
          "types": ["country", "political"]
        }
      ]
    }
  ],
  "status": "OK"
}
```

Campos clave:

- `geometry.location.lat` / `geometry.location.lng` → punto principal del municipio
- `geometry.viewport` → “caja” aproximada de la ciudad (sirve para limitar búsquedas)
- `address_components` → información jerárquica (localidad, provincia, país, etc.)

---

### 2.3. Places API (Text Search / Nearby / Place Details)

**Objetivo:** obtener muchos puntos con lat/lng dentro del municipio.

#### 2.3.1. Places Text Search

Busca lugares por texto (por ejemplo “restaurantes en Sevilla”) y devuelve lat/lng y otros datos. ([Google Maps Platform][2])

**Endpoint (GET):**

```http
GET https://maps.googleapis.com/maps/api/place/textsearch/json
  ?query=Sevilla,+España
  &type=point_of_interest
  &key=YOUR_API_KEY
```

> `type` se puede cambiar para obtener solo cierto tipo de puntos:
> `restaurant`, `park`, `school`, etc.

**Respuesta (simplificada):**

```json
{
  "results": [
    {
      "name": "Catedral de Sevilla",
      "formatted_address": "Av. de la Constitución, s/n, 41004 Sevilla, España",
      "geometry": {
        "location": {
          "lat": 37.386,
          "lng": -5.992
        }
      },
      "types": [
        "tourist_attraction",
        "church",
        "point_of_interest",
        "establishment"
      ],
      "place_id": "ChIJ...id"
    },
    {
      "name": "Plaza de España",
      "formatted_address": "Av. Isabel la Católica, 41004 Sevilla, España",
      "geometry": {
        "location": {
          "lat": 37.377,
          "lng": -5.986
        }
      },
      "types": ["tourist_attraction", "point_of_interest", "establishment"],
      "place_id": "ChIJ...id2"
    }
  ],
  "status": "OK"
}
```

Campos clave:

- `results[i].geometry.location.lat`
- `results[i].geometry.location.lng`
- `results[i].name`
- `results[i].formatted_address`
- `results[i].types`
- `results[i].place_id` (sirve para pedir más detalles después)

#### 2.3.2. Place Details (para barrios / zonas)

Con el `place_id`, puedes pedir **más detalles** de cada punto. A menudo incluye componentes como `neighborhood` o `sublocality` que puedes usar como “barrio”. ([Google for Developers][5])

**Endpoint (GET):**

```http
GET https://maps.googleapis.com/maps/api/place/details/json
  ?place_id=PLACE_ID_AQUI
  &fields=address_component,geometry,name
  &key=YOUR_API_KEY
```

En `address_components` verás elementos con tipos como:

- `"neighborhood"` → barrio
- `"sublocality"` / `"sublocality_level_1"` → subzona dentro de la ciudad
- `"locality"` → ciudad
  Estos campos son los que el agente debe usar para etiquetar “barrios” o zonas.

---

## 3. Flujo funcional de la app

### 3.1. Búsqueda por municipio

1. El usuario introduce un municipio: `"Sevilla"`.
2. La app llama a **Geocoding API** con `address=Sevilla,España`.
3. Se guarda:

   - `municipio.lat` / `municipio.lng`
   - `municipio.viewport` (northeast / southwest)

4. Se muestra el municipio centrado en un mapa.

### 3.2. Obtención de puntos dentro del municipio

1. El usuario selecciona un tipo de punto y filtros:

   - Tipo: `restaurant`, `park`, `school`, etc.
   - Palabra clave opcional: “vegano”, “centro cívico”, etc.

2. La app llama a **Places Text Search**:

   - `query`: algo como `"restaurant in Sevilla, España"`
   - Opcional: se puede limitar usando `location` + `radius` alrededor del centro de la ciudad.

3. Se muestran los resultados como lista + marcadores en el mapa.

### 3.3. Asociar puntos a barrios / zonas

Para cada resultado:

1. Se obtiene su `place_id`.

2. Se llama a **Place Details** y se examinan los `address_components`:

   - Si hay un componente con tipo `"neighborhood"` → usarlo como barrio.
   - Si no hay neighborhood, usar `"sublocality"` (por ejemplo `"Triana"`, `"Nervión"` si Google lo devuelve).
   - Siempre guardar también:

     - `locality` (ciudad)
     - `administrative_area_level_1` (CCAA)
     - `country`

3. Cada punto se guarda en un JSON interno con estructura similar a:

```json
{
  "id": "PLACE_ID_AQUI",
  "nombre": "Catedral de Sevilla",
  "lat": 37.386,
  "lng": -5.992,
  "direccion": "Av. de la Constitución, s/n, 41004 Sevilla, España",
  "barrio": "Centro Histórico",
  "municipio": "Sevilla",
  "provincia": "Sevilla",
  "ccaa": "Andalucía",
  "pais": "España",
  "tipos": ["tourist_attraction", "point_of_interest"]
}
```

---

## 4. Especificación técnica para el desarrollador / agente

### 4.1. Requisitos previos

1. Tener un **proyecto en Google Cloud**.
2. Habilitar las APIs:

   - Geolocation API (SKU: Geolocation)
   - Geocoding API
   - Places API

3. Crear una **API key** y **restringirla** (por dominio, IP o app) según el tipo de cliente. ([Google Cloud Documentation][6])
4. Activar facturación (hay créditos mensuales gratuitos por SKU). ([Google for Developers][7])

### 4.2. Variables de entorno

El agente debe asumir que la API key **nunca se hardcodea** en el código:

- `GOOGLE_MAPS_API_KEY=...`

En frontend, usar mecanismos seguros (proxy backend o restricciones de dominio).

### 4.3. Endpoints internos sugeridos (backend propio)

Se propone que la app tenga su **propia API** que envuelva a Google Maps, por ejemplo:

#### `GET /api/municipios?nombre=Sevilla`

- Parámetros:

  - `nombre`: string

- Lógica:

  - Llama a Geocoding API con `address={nombre},España`
  - Devuelve solo los datos necesarios:

```json
{
  "nombre": "Sevilla",
  "lat": 37.3890924,
  "lng": -5.9844589,
  "viewport": {
    "northeast": { "lat": 37.45, "lng": -5.88 },
    "southwest": { "lat": 37.33, "lng": -6.05 }
  }
}
```

#### `GET /api/puntos`

- Parámetros:

  - `municipio`: "Sevilla"
  - `tipo`: opcional, p.e. "restaurant", "park"
  - `barrio`: opcional, filtro de texto sobre `neighborhood` o `sublocality`

- Lógica:

  1. Geocoding (si no se tiene ya caché del municipio).
  2. Places Text Search con `query = tipo + " in " + municipio`.
  3. Para cada resultado, opcionalmente Place Details para barrio.
  4. Filtrado por `barrio` si se ha indicado.

- Respuesta: lista de puntos con la estructura homogénea definida antes.

#### `POST /api/geolocation`

- Parámetros:

  - Cuerpo vacío o con datos de redes si se quieren usar.

- Lógica:

  - Llama a Geolocation API.

- Respuesta:

```json
{
  "lat": 37.4219983,
  "lng": -122.084,
  "accuracy": 1200.4
}
```

---

## 5. Estructura del JSON que la app debe manejar

Estructura mínima recomendada para un “punto geolocalizado”:

```json
{
  "id": "string",
  "nombre": "string",
  "lat": 0.0,
  "lng": 0.0,
  "direccion": "string",
  "barrio": "string|null",
  "municipio": "string",
  "provincia": "string|null",
  "ccaa": "string|null",
  "pais": "string",
  "tipos": ["string"]
}
```

El agente debe:

- Asegurar que **lat/lng** siempre están presentes.
- Permitir que `barrio`, `provincia` y `ccaa` sean `null` si Google no los devuelve.

---

## 6. Barrios y zonas: cómo obtenerlos

1. Cada lugar tiene `address_components` con distintos tipos.

2. Para determinar el barrio:

   Recorrer `address_components` y buscar, en este orden:

   - tipo `"neighborhood"`
   - tipo `"sublocality"` o `"sublocality_level_1"`

3. Si no se encuentra nada, dejar `barrio: null`.

Ejemplo de `address_components` típico (simplificado):

```json
"address_components": [
  { "long_name": "Triana", "types": ["neighborhood", "political"] },
  { "long_name": "Sevilla", "types": ["locality", "political"] },
  { "long_name": "Sevilla", "types": ["administrative_area_level_2", "political"] },
  { "long_name": "Andalucía", "types": ["administrative_area_level_1", "political"] },
  { "long_name": "España", "types": ["country", "political"] }
]
```

Aquí:

- `barrio = "Triana"`
- `municipio = "Sevilla"`
- `ccaa = "Andalucía"`
- `pais = "España"`

---

## 7. Costes y cuotas (visión rápida)

- **Modelo de pago**: pay-as-you-go, cada tipo de petición cuenta como un SKU. ([Google for Developers][8])
- SKUs relevantes:

  - `Geocoding`
  - `Geolocation`
  - `Places API` (búsquedas y detalles) ([Google for Developers][7])

- Cada SKU tiene:

  - Precio por cada 1000/10.000 solicitudes
  - Créditos mensuales gratuitos por SKU (consultar tabla actualizada de Google Maps Platform). ([Google for Developers][8])

El agente debe:

- Implementar **caché** (por ejemplo en BD) para no repetir Geocoding de los mismos municipios constantemente.
- Limitar el número de resultados y peticiones a Place Details por cada búsqueda para controlar costes.

---

## 8. Checklist para el agente / desarrollador

1. **Configurar Google Cloud**

   - [ ] Crear proyecto y activar Geolocation, Geocoding y Places API.
   - [ ] Generar API key y restringirla.

2. **Backend**

   - [ ] Crear variables de entorno `GOOGLE_MAPS_API_KEY`.
   - [ ] Implementar endpoint `/api/municipios` usando Geocoding.
   - [ ] Implementar endpoint `/api/puntos` usando Places Text Search (+ Place Details opcional).
   - [ ] Implementar endpoint `/api/geolocation` para usar el SKU Geolocation.
   - [ ] Implementar caché de municipios y de resultados para reducir llamadas.

3. **Lógica de barrios / zonas**

   - [ ] Extraer `neighborhood` / `sublocality` de `address_components`.
   - [ ] Permitir filtrar puntos por barrio.

4. **Frontend**

   - [ ] Formulario para elegir municipio.
   - [ ] Opciones de filtro: tipo de lugar, barrio, palabra clave.
   - [ ] Mapa centrado en el municipio.
   - [ ] Marcadores para cada punto + panel con lista de resultados.

5. **Control de costes**

   - [ ] Limitar número de resultados por búsqueda (p.ej. 20–50).
   - [ ] Evitar llamar a Place Details para todos los puntos si no es necesario.
   - [ ] Monitorizar uso de SKUs en Google Cloud.

---
