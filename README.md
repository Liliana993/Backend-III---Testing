# 🚚 ShipNow API — Backend III | Entrega Final

API REST para la gestión de usuarios, productos, órdenes y entregas de ShipNow, desarrollada con Node.js, Express y MongoDB.

El proyecto implementa una arquitectura por capas e incorpora gestión de archivos, validaciones, manejo centralizado de errores, logging, pruebas automatizadas, paginación, filtros, monitoreo y despliegue mediante Docker.

Esta versión corresponde al Proyecto Final Backend III e integra mejoras de rendimiento, configuración de entornos y ejecución de la API en contenedores.

---

# 🎯 Objetivo del proyecto

El proyecto utiliza una arquitectura basada en capas:

```text
Route → Controller → Service → Repository → Model → MongoDB
```

Esta separación permite mantener responsabilidades claras, facilitar el mantenimiento del código y evitar que los Controllers tengan acceso directo a la base de datos.

La API permite:

- Gestionar usuarios, productos, órdenes y entregas.
- Generar datos simulados mediante Faker.
- Insertar datos de prueba en MongoDB mediante un endpoint de seed.
- Mantener relaciones entre las entidades.
- Gestionar la carga de documentos y comprobantes mediante Multer.
- Validar datos y parámetros de las solicitudes.
- Centralizar los tipos de error mediante `ERROR_TYPES`.
- Crear errores personalizados mediante `CustomError`.
- Procesar errores mediante un middleware global.
- Registrar eventos y errores mediante Winston.
- Documentar los endpoints mediante Swagger.
- Ejecutar pruebas funcionales automatizadas.
- Consultar recursos mediante filtros y paginación.
- Monitorear el estado de la API mediante un health check.
- Ejecutar la aplicación dentro de un contenedor Docker.

---

# 🏗️ Arquitectura

El proyecto utiliza una arquitectura por capas.

### Route

Define los endpoints disponibles de la API y delega las solicitudes al Controller correspondiente.

### Controller

Es la puerta de entrada HTTP.

Sus responsabilidades son:

- Recibir `req` y `res`.
- Obtener parámetros, query params y body.
- Invocar los métodos del Service.
- Devolver las respuestas exitosas.
- Delegar los errores al middleware global mediante `next(error)`.

El Controller no accede directamente a Mongoose ni MongoDB.

### Service

Contiene la lógica de negocio de la aplicación.

Sus responsabilidades incluyen:

- Validaciones de negocio.
- Comprobaciones previas a las operaciones.
- Reglas relacionadas con estados y datos.
- Coordinación entre diferentes repositories.
- Detección y generación de errores de dominio.

El Service no maneja directamente `req` ni `res`.

Cuando ocurre un error de negocio, el Service genera un `CustomError` que posteriormente será procesado por el middleware global.

### Repository

Es la capa encargada de comunicarse con Mongoose/MongoDB.

Sus responsabilidades incluyen:

- Consultas a la base de datos.
- Creación, actualización y eliminación de documentos.
- Filtros y proyecciones.
- Uso de `populate`.
- Ordenamiento y paginación de resultados.

### Model

Define los esquemas y modelos utilizados por Mongoose.

### MongoDB

Es la capa de persistencia de los datos.

---

# 📁 Estructura del proyecto

La estructura general del proyecto es:

```text
ShipNow/
│
├── src/
│   ├── config/
│   │   ├── env.config.js
│   │   ├── logger.config.js
│   │   ├── multer.config.js
│   │   └── swagger.js
│   │
│   ├── constants/
│   │   └── index.js
│   │
│   ├── controllers/
│   ├── docs/
│   ├── errors/
│   │   ├── CustomError.js
│   │   └── errorDictionary.js
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── upload.middleware.js
│   │
│   ├── mocks/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── users/
│   ├── products/
│   ├── orders/
│   ├── deliveries/
│   ├── mocks/
│   ├── logger/
│   ├── docs/
│   └── setup.js
│
├── .dockerignore
├── .env.example
├── .env.test.example
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Tecnologías utilizadas

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript ES Modules

### Herramientas y librerías

- Multer: carga y gestión de archivos.
- Mocha: ejecución de pruebas.
- Chai: aserciones.
- Supertest: pruebas HTTP.
- cross-env: configuración de variables de entorno en scripts.
- Winston: logging.
- winston-daily-rotate-file: rotación de archivos de log.
- Faker: generación de datos simulados.
- bcrypt: encriptación de contraseñas.
- dotenv: gestión de variables de entorno.
- CORS: configuración de acceso entre orígenes.
- Swagger / OpenAPI: documentación de la API.

---

# 📤 Carga de archivos con Multer

Se incorpora Multer para gestionar la carga de archivos mediante formularios `multipart/form-data`.

La configuración se encuentra centralizada en:

```text
src/config/multer.config.js
```

El middleware encargado de validar los archivos se encuentra en:

```text
src/middlewares/upload.middleware.js
```

### Tipos de archivos permitidos

- PDF
- JPG
- JPEG
- PNG

### Restricciones de carga

| Validación | Límite |
|---|---|
| Tamaño máximo por archivo | 5 MB |
| Cantidad máxima de comprobantes por solicitud | 5 archivos |
| Formatos permitidos | PDF, JPG, JPEG, PNG |

Los archivos se almacenan en el sistema de archivos local y se generan nombres únicos para evitar conflictos.

### Documentos de usuarios

Endpoint:

```http
POST /api/users/:id/documents
```

Permite cargar documentación asociada a un usuario existente.

Campos:

| Campo | Descripción |
|---|---|
| `document` | Archivo que se desea cargar. |
| `documentType` | Tipo de documento: DNI, LICENSE u OTHER. |

Directorios de almacenamiento:

```text
uploads/users/documents/
uploads/users/licenses/
```

### Comprobantes de entregas

Endpoint:

```http
POST /api/deliveries/:id/proofs
```

Permite cargar uno o varios comprobantes asociados a una entrega existente.

Campo:

| Campo | Descripción |
|---|---|
| `proof` | Uno o varios archivos de comprobantes. |

Se admiten hasta cinco archivos por solicitud.

Directorio de almacenamiento:

```text
uploads/deliveries/proofs/
```

### Almacenamiento de metadatos

Los archivos se guardan físicamente en el servidor, mientras que MongoDB almacena sus metadatos. Los modelos mantienen información sobre los archivos sin almacenar directamente su contenido binario.

### Manejo de errores

La implementación contempla:

- Archivo obligatorio.
- Tipo de archivo no permitido.
- Tamaño máximo excedido.
- Campo de archivo incorrecto.
- Tipo de documento inválido.
- Usuario o entrega inexistente.
- Error durante el almacenamiento del archivo.

Los errores se procesan mediante el middleware centralizado y el diccionario de errores de la aplicación.

Si ocurre un error durante el proceso, se realiza la limpieza de los archivos físicos correspondientes para evitar archivos huérfanos.

---

# 🔐 Configuración del entorno

Las variables de entorno se centralizan en el módulo de configuración.

El proyecto utiliza archivos `.env` para las variables locales. Estos archivos no deben subirse al repositorio.

Se incluyen dos archivos de ejemplo:

- `.env.example`: configuración del entorno de desarrollo.
- `.env.test.example`: configuración del entorno de testing.

### Variables principales

| Variable | Descripción |
|---|---|
| `PORT` | Puerto utilizado por el servidor. |
| `MONGODB_URI` | URI de conexión a MongoDB. |
| `NODE_ENV` | Entorno de ejecución. |
| `JWT_SECRET` | Clave utilizada para operaciones relacionadas con autenticación. |
| `LOG_LEVEL` | Nivel de detalle de los registros generados por Winston. |

Las variables críticas son validadas al iniciar la aplicación.

La configuración contempla la validación de:

- Variables requeridas.
- Puerto válido.
- Entorno permitido.
- Nivel de logging admitido.

Si falta una variable requerida o su valor no es válido, la aplicación muestra un error descriptivo y detiene el inicio.

### Entorno de desarrollo

Crear el archivo `.env` a partir de `.env.example` y completar las variables correspondientes.

### Entorno de testing

Para ejecutar las pruebas se utiliza un archivo independiente llamado `.env.test`.

Ejemplo:

```env
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow_test
JWT_SECRET=clave_secreta_exclusiva_para_testing
```

La base de datos `shipnow_test` se utiliza exclusivamente para las pruebas automatizadas, evitando modificar los datos del entorno de desarrollo.

El archivo `.env.test` no debe subirse al repositorio. Para compartir la configuración se incluye `.env.test.example`, sin credenciales reales.

---

# ❤️ Health Check

La API incorpora un endpoint de monitoreo que permite verificar si el servidor se encuentra funcionando correctamente.

**Endpoint:**

```http
GET /api/health
```

**Ejemplo de respuesta:**

```json
{
  "status": "ok",
  "timestamp": "2026-11-22T12:36:13.838Z",
  "environment": "production",
  "uptime": 58.381121134
}
```

La respuesta proporciona:

- `status`: estado actual de la API.
- `timestamp`: fecha y hora de la consulta.
- `environment`: entorno de ejecución.
- `uptime`: tiempo que lleva activo el proceso del servidor, expresado en segundos.

Este endpoint permite comprobar el estado de la aplicación sin exponer información sensible ni credenciales.

---

# 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Liliana993/Backend-III---Testing.git
```

### 2. Ingresar al proyecto

```bash
cd ShipNow
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Crear el archivo de entorno

A partir del archivo de ejemplo:

```bash
cp .env.example .env
```

Para testing:

```bash
cp .env.test.example .env.test
```

En Windows también se pueden crear ambos archivos manualmente.

Completar las variables de entorno con los valores correspondientes y verificar que MongoDB se encuentre disponible.

---

# 🧪 Testing funcional

El proyecto incorpora pruebas funcionales automatizadas para verificar el comportamiento de los principales endpoints de la API REST.

Se utilizan Mocha, Chai y Supertest para ejecutar las pruebas, realizar solicitudes HTTP y comprobar las respuestas.

### Herramientas utilizadas

| Herramienta | Función |
|---|---|
| Mocha | Framework para organizar y ejecutar las pruebas. |
| Chai | Librería de aserciones para validar resultados. |
| Supertest | Permite realizar solicitudes HTTP a la aplicación Express. |
| cross-env | Permite establecer variables de entorno de forma compatible entre sistemas operativos. |

### Separación entre aplicación y servidor

Para facilitar las pruebas, la configuración de Express se encuentra separada del inicio del servidor.

- `src/app.js`: configura Express, registra middlewares y rutas, y exporta la aplicación.
- `src/server.js`: establece la conexión con MongoDB e inicia el servidor mediante `app.listen()`.

De esta manera, Supertest puede importar la aplicación sin iniciar un servidor HTTP independiente.

### Organización de las pruebas

Los archivos de testing se encuentran dentro de la carpeta `tests/`, organizados por recurso:

```text
tests/
├── users/
├── products/
├── orders/
├── deliveries/
├── mocks/
├── logger/
├── docs/
└── setup.js
```

### Requisitos previos

Antes de ejecutar la suite de pruebas, verificar que se cumplan los siguientes requisitos:

- Tener Node.js y npm instalados.
- Tener MongoDB instalado y el servicio iniciado.
- Contar con una conexión disponible mediante la URI configurada en `.env.test`.
- Haber instalado las dependencias mediante `npm install`.

El archivo `.env.test` debe apuntar a la base de datos exclusiva de pruebas:

```env
NODE_ENV=test
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow_test
```

La instancia de MongoDB debe estar activa antes de ejecutar `npm test`.

### Configuración inicial de las pruebas

El archivo `tests/setup.js` centraliza la configuración de la base de datos utilizada durante el testing.

Sus responsabilidades son:

- Verificar que el entorno sea `test`.
- Comprobar que la base de datos utilizada sea exclusivamente `shipnow_test`.
- Establecer la conexión con MongoDB antes de ejecutar las pruebas.
- Limpiar las colecciones antes de cada prueba.
- Cerrar la conexión al finalizar la ejecución.

La limpieza de las colecciones permite que las pruebas comiencen con datos controlados y no dependan de registros creados anteriormente.

### Ejecutar las pruebas

El proyecto utiliza el siguiente comando:

```bash
npm test
```

El script configurado en `package.json` es:

```json
"test": "cross-env NODE_ENV=test mocha --require tests/setup.js \"tests/**/*.test.js\" --timeout 10000"
```

Este comando establece el entorno de testing, carga la configuración inicial y ejecuta todos los archivos de prueba encontrados dentro de `tests/`.

### Módulos cubiertos

**Usuarios**

Se verifican operaciones como:

- Obtener todos los usuarios.
- Obtener una lista vacía cuando no existen registros.
- Crear un usuario correctamente.
- Rechazar datos incompletos.
- Rechazar usuarios duplicados.
- Obtener un usuario por ID.
- Manejar usuarios inexistentes.
- Actualizar y eliminar usuarios.
- Verificar que un usuario eliminado ya no exista.
- Cargar documentos asociados a un usuario.
- Comprobar la persistencia de los metadatos del documento.
- Rechazar valores inválidos para `documentType`.
- Rechazar la carga cuando el usuario no existe.
- Rechazar cuerpos JSON que superan el tamaño máximo permitido.

**Productos**

Se verifican las operaciones principales y la paginación, incluyendo:

- Consulta de productos.
- Respuestas paginadas.
- Validación de los parámetros `page` y `limit`.
- Rechazo de parámetros inválidos.
- Rechazo de límites superiores al máximo permitido.

**Órdenes**

Se verifican operaciones como:

- Obtener órdenes.
- Obtener una lista vacía cuando no existen registros.
- Crear una orden válida asociada a un usuario.
- Rechazar órdenes con datos incompletos.
- Obtener una orden por ID.
- Manejar órdenes inexistentes.
- Actualizar el estado de una orden.
- Rechazar estados inválidos.
- Eliminar una orden.
- Verificar que la orden eliminada ya no exista.
- Consultar resultados paginados.

**Entregas**

Se verifican las operaciones de consulta y gestión de entregas, incluyendo la paginación y las consultas asociadas a repartidores.

También se contemplan los escenarios de carga de comprobantes y sus validaciones.

**Mocking**

Se verifican las siguientes funcionalidades:

- Generar usuarios simulados.
- Generar repartidores simulados.
- Validar la estructura de los datos generados.
- Rechazar cantidades iguales a cero.
- Rechazar cantidades superiores al máximo permitido.
- Verificar que los mocks generados no se persistan cuando corresponde.
- Insertar datos de prueba mediante el endpoint seed.
- Comprobar las cantidades de usuarios, clientes, repartidores, órdenes y entregas insertadas.
- Rechazar cantidades inválidas y valores decimales.

**Logger**

Se verifica el endpoint:

```http
GET /api/logger/test
```

Se comprueba que responda correctamente y devuelva una estructura de respuesta exitosa con un mensaje.

**Swagger**

Se verifica el acceso a la documentación interactiva mediante:

```http
GET /api-docs/
```

Se comprueba que el endpoint responda con estado HTTP 200 y contenido HTML correspondiente a Swagger UI.

### Base de datos de testing

Las pruebas utilizan una base de datos independiente:

```text
shipnow_test
```

No se utiliza la base de datos de desarrollo para evitar modificar información del proyecto durante la ejecución de los tests.

Además, las colecciones se limpian antes de cada prueba para mantener resultados controlados y repetibles.

### Resultado de las pruebas

En la última ejecución registrada de la suite funcional se obtuvo:

```text
58 passing
0 failing
```

La suite incluye pruebas de los principales recursos de la API, validaciones, respuestas de error y funcionalidades incorporadas durante el Módulo 8.

---

# 📚 Documentación de la API con Swagger

ShipNow utiliza Swagger (OpenAPI) para documentar los endpoints de la API REST y facilitar su exploración y prueba.

La documentación interactiva permite consultar las rutas disponibles, conocer los parámetros requeridos, visualizar los formatos de respuesta y ejecutar solicitudes HTTP directamente desde Swagger UI.

### Acceso a la documentación

Una vez iniciado el servidor, acceder a:

```text
http://localhost:3000/api-docs
```

Si se configuró otro puerto mediante variables de entorno, reemplazar `3000` por el puerto correspondiente.

### Funcionalidades documentadas

| Categoría | Descripción |
|---|---|
| Users | Operaciones relacionadas con usuarios. |
| Products | Operaciones relacionadas con productos. |
| Orders | Consulta y gestión de órdenes. |
| Deliveries | Consulta y gestión de entregas, asignación de conductores y actualización de estados y prioridades. |
| Mocks | Generación de datos ficticios e inserción de datos de prueba. |
| Logger | Pruebas de los niveles de logging configurados en la aplicación. |

### Cómo probar los endpoints

1. Iniciar el servidor de ShipNow.
2. Abrir Swagger UI en `http://localhost:3000/api-docs`.
3. Seleccionar la categoría del endpoint que se desea probar.
4. Expandir la operación HTTP correspondiente.
5. Hacer clic en **Try it out**.
6. Completar los parámetros requeridos.
7. Hacer clic en **Execute**.
8. Revisar el código HTTP, los encabezados y el cuerpo de la respuesta.

### Consideraciones

- Los ejemplos y esquemas de respuesta describen el comportamiento esperado de cada endpoint.
- Los resultados reales dependen de los datos disponibles y de la implementación del backend.
- El endpoint `POST /api/mocks/seed` inserta datos en la base de datos; utilizarlo con precaución.
- El endpoint `GET /api/logger/test` ejecuta mensajes de prueba en los niveles de logging configurados.
- Swagger no está disponible cuando la aplicación se ejecuta en producción.

---

# ▶️ Ejecutar el proyecto

### Modo desarrollo

```bash
npm run dev
```

### Modo normal

```bash
npm start
```

Por defecto, la API utiliza:

```text
http://localhost:3000
```

### Health check

```http
GET /api/health
```

---

# 👤 Usuarios

Endpoints principales:

```http
GET    /api/users
GET    /api/users/:id
GET    /api/users/email/:email
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

Los roles se encuentran centralizados mediante constantes inmutables:

```js
USER_ROLE
```

Ejemplos:

```js
USER_ROLE.ADMIN
USER_ROLE.CUSTOMER
USER_ROLE.DRIVER
USER_ROLE.STORE
```

---

# 📦 Productos

Endpoints principales:

```http
GET    /api/products
GET    /api/products/:id
GET    /api/products/name/:name
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Los estados de producto se encuentran centralizados mediante:

```js
PRODUCT_STATUS
```

Ejemplos:

```js
PRODUCT_STATUS.AVAILABLE
PRODUCT_STATUS.OUT_OF_STOCK
PRODUCT_STATUS.DISCONTINUED
```

La consulta de productos permite utilizar filtros como estado, rango de precios y disponibilidad de stock.

Ejemplo:

```http
GET /api/products?status=available
```

---

# 🛵 Órdenes y entregas

El proyecto cuenta con módulos para la gestión de órdenes y entregas:

```http
/api/orders
/api/deliveries
```

Estos módulos siguen la misma separación de responsabilidades:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Model
  ↓
MongoDB
```

Las órdenes y entregas utilizan constantes para sus estados y prioridades.

---

# 📄 Paginación y filtros

Para optimizar las consultas y mejorar el rendimiento de la API, se incorporó paginación en los endpoints de usuarios, productos, órdenes y entregas.

La paginación permite recuperar los registros en bloques, evitando cargar grandes cantidades de información en una sola solicitud.

### Parámetros de paginación

Los endpoints admiten los siguientes parámetros mediante query string:

| Parámetro | Descripción |
|---|---|
| `page` | Número de página solicitada. |
| `limit` | Cantidad máxima de registros por página. |

La paginación utiliza valores predeterminados cuando no se especifican parámetros y limita la cantidad máxima de registros por consulta.

Los parámetros `page` y `limit` deben ser números enteros positivos. El límite máximo permitido es de 100 registros por página. Si se proporcionan valores inválidos, la API responde con un error HTTP 400.

### Endpoints con paginación

**Usuarios**

```http
GET /api/users?page=1&limit=10
```

**Productos**

```http
GET /api/products?page=1&limit=10
```

Permite aplicar filtros por estado, precio mínimo, precio máximo y disponibilidad de stock.

**Órdenes**

```http
GET /api/orders?page=1&limit=10
```

También permite aplicar filtros por estado, prioridad y cliente.

**Entregas**

```http
GET /api/deliveries?page=1&limit=10
```

Permite filtrar por estado, prioridad y repartidor.

Las consultas de entregas asociadas a un repartidor también admiten paginación.

### Información de paginación

Las respuestas incluyen los registros obtenidos y metadatos para conocer:

- Cantidad total de registros.
- Página actual.
- Límite de registros por página.
- Cantidad total de páginas.

Además, las consultas contemplan los casos en los que no existen registros o se solicita una página fuera del rango disponible.

---

# 🎲 Sistema de Mocking

El sistema de mocking utiliza Faker para generar datos simulados.

Los datos generados respetan la estructura de los modelos reales de ShipNow.

Los módulos de mocking se encuentran separados de las rutas:

```text
src/mocks/
```

La lógica de coordinación se encuentra en:

```text
src/services/mock.service.js
```

Las rutas específicas se encuentran en:

```text
src/routes/mock.js
```

### Generación de usuarios

Endpoint:

```http
GET /api/mocks/users?qty=10
```

Genera usuarios simulados sin almacenarlos en MongoDB.

Este endpoint solamente genera los datos y no los persiste.

Los roles utilizados provienen de las constantes del proyecto.

### Generación de repartidores

Endpoint:

```http
GET /api/mocks/drivers?qty=10
```

Genera usuarios cuyo rol es:

```text
driver
```

Los registros generados no se almacenan en MongoDB.

### Seed de datos de prueba

Endpoint:

```http
POST /api/mocks/seed?qty=3
```

El endpoint genera e inserta datos de prueba en MongoDB.

Por cada cantidad solicitada se generan:

- Un customer.
- Un driver.
- Una order.
- Una delivery.

Ejemplo de respuesta:

```json
{
  "status": "success",
  "message": "Datos de prueba insertados correctamente",
  "data": {
    "inserted": {
      "users": 6,
      "customers": 3,
      "drivers": 3,
      "orders": 3,
      "deliveries": 3
    }
  }
}
```

Los registros son almacenados mediante los respectivos Repositories.

---

# 🔗 Relaciones entre entidades

El sistema mantiene las relaciones principales del dominio.

### Order → Customer

Cada pedido generado se asocia a un usuario con rol:

```text
customer
```

### Delivery → Order

Cada entrega generada se asocia a un pedido existente.

### Delivery → Driver

Cada entrega puede asociarse a un usuario cuyo rol es:

```text
driver
```

La estructura resultante es:

```text
User
 ├── customer
 │      ↓
 │    Order
 │      ↓
 │   Delivery
 │      ↑
 └── driver
```

Las relaciones fueron implementadas utilizando referencias de MongoDB y `populate()` en los Repositories correspondientes.

---

# 🔐 Contraseñas

Las contraseñas de los usuarios persistidos no se almacenan en texto plano.

El modelo User utiliza bcrypt mediante un middleware `pre("save")`.

Flujo:

```text
password original
      ↓
User.create()
      ↓
pre("save")
      ↓
bcrypt.hash()
      ↓
MongoDB
```

La contraseña utilizada para los datos de prueba es:

```text
coder123
```

Cuando un usuario es almacenado, la contraseña se transforma en un hash mediante bcrypt.

---

# 📏 Validación de cantidades

La generación de datos utiliza los parámetros definidos en las constantes del proyecto.

Actualmente se permite generar entre:

```text
1 y 50 registros
```

Ejemplo válido:

```http
GET /api/mocks/users?qty=10
```

Ejemplos inválidos:

```http
GET /api/mocks/users?qty=0
GET /api/mocks/users?qty=-5
POST /api/mocks/seed?qty=51
GET /api/mocks/users?qty=abc
```

También se rechazan valores que no sean números enteros válidos.

Las cantidades inválidas son procesadas mediante el sistema centralizado de errores.

---

# ❗ Manejo profesional de errores

El proyecto incorpora un sistema centralizado para el manejo de errores.

El objetivo es evitar que cada Controller o Route construya respuestas diferentes y permitir que todos los errores sean procesados mediante una única capa.

La estructura implementada es:

```text
Service
   ↓
CustomError
   ↓
Controller
   ↓
next(error)
   ↓
errorHandler
   ↓
HTTP Response
```

### Errores de validación

Los errores de validación de negocio son detectados en la capa Service.

Por ejemplo, al buscar un usuario inexistente:

```js
const user = await userRepository.getById(id);

if (!user) {
  throw CustomError.createError({
    name: ERROR_TYPES.USER_NOT_FOUND,
    cause: `No existe un usuario con id ${id}`
  });
}
```

El Controller no genera la respuesta de error. Solamente propaga el error:

```js
catch (error) {
  next(error);
}
```

El middleware global es quien construye la respuesta HTTP.

### Errores de órdenes y entregas

Las mismas reglas se aplican a órdenes y entregas.

Ejemplos de errores contemplados:

```text
ORDER_NOT_FOUND
DELIVERY_NOT_FOUND
INVALID_STATUS
VALIDATION_ERROR
```

Por ejemplo, una operación de delivery puede generar un error si intenta ejecutarse en un estado no permitido.

Esto permite centralizar las reglas relacionadas con el flujo de estados.

### Errores del sistema de Mocking

El sistema de mocking también utiliza el manejo centralizado de errores.

**Cantidad inválida**

Las cantidades se validan antes de generar datos.

Estos casos generan:

```text
INVALID_QUANTITY
```

Con status HTTP:

```text
400 Bad Request
```

**Error durante la generación**

Los errores producidos durante la generación de usuarios y drivers son transformados en:

```text
MOCK_GENERATION_ERROR
```

Con status HTTP:

```text
500 Internal Server Error
```

**Error durante la persistencia**

Los errores producidos durante la carga de datos mock en MongoDB son transformados en:

```text
MOCK_DATABASE_ERROR
```

Con status HTTP:

```text
500 Internal Server Error
```

De esta manera, los errores de generación y persistencia no quedan expuestos directamente al cliente.

### Límite de tamaño del cuerpo JSON

Para evitar solicitudes con cuerpos JSON excesivamente grandes, se configuró un límite máximo de 1 MB mediante Express:

```js
app.use(express.json({ limit: "1mb" }));
```

Cuando una solicitud supera ese límite, el middleware global identifica el error y devuelve una respuesta HTTP `413 Payload Too Large`.

El código interno utilizado es:

```text
PAYLOAD_TOO_LARGE
```

La respuesta mantiene el formato uniforme de errores de la API:

```json
{
  "status": "error",
  "error": "PAYLOAD_TOO_LARGE",
  "message": "El cuerpo de la solicitud supera el tamaño máximo permitido",
  "cause": "..."
}
```

### Manejo de errores de Mongoose

El middleware global contempla errores de validación de Mongoose y errores `CastError`, que se producen cuando se proporciona un identificador con formato inválido.

Estos errores se transforman en respuestas controladas con status HTTP 400.

### Pruebas de manejo de errores

Se realizaron pruebas utilizando los endpoints de la API.

Entre los escenarios contemplados se encuentran:

| Escenario | Resultado esperado |
|---|---|
| Cantidad igual a cero | HTTP 400 |
| Cantidad negativa | HTTP 400 |
| Cantidad superior al máximo | HTTP 400 |
| Identificador inválido | HTTP 400 |
| Cuerpo JSON superior a 1 MB | HTTP 413 |
| Recurso inexistente | Respuesta de error controlada |

El middleware global detecta los errores correspondientes y los transforma en respuestas uniformes.

### Formato de respuesta de error

Las respuestas utilizan una estructura uniforme:

```json
{
  "status": "error",
  "error": "USER_NOT_FOUND",
  "message": "Usuario no encontrado",
  "cause": "No existe un usuario con id 123"
}
```

La estructura general es:

```text
status
error
message
cause
```

Esto permite que el cliente pueda interpretar los errores de forma predecible.

---

# 📋 Logging y monitoreo básico

Se incorpora un sistema centralizado de logging utilizando Winston y `winston-daily-rotate-file`.

El objetivo es evitar el uso disperso de `console.log()` y `console.error()` y centralizar los eventos importantes de la aplicación.

El logger se encuentra centralizado en:

```text
src/config/logger.config.js
```

Los componentes de prueba del logger se encuentran en:

```text
src/routes/logger.js
src/controllers/logger.controller.js
src/services/logger.service.js
```

### Niveles de logging

El proyecto utiliza los siguientes niveles:

| Nivel | Uso |
|---|---|
| `debug` | Información detallada para desarrollo y diagnóstico. |
| `http` | Eventos relacionados con solicitudes HTTP. |
| `info` | Eventos normales y operaciones exitosas. |
| `warning` | Situaciones esperables que requieren atención. |
| `error` | Errores de la aplicación que no detienen necesariamente el proceso. |
| `fatal` | Errores críticos que impiden continuar la ejecución. |

### Ejemplos implementados

- Inicio del servidor → `info`.
- Conexión a MongoDB → `info`.
- Inicio y finalización del seed → `debug` / `info`.
- Cantidad inválida en mocks → `warning`.
- Ruta inexistente → `warning`.
- Errores inesperados → `error`.
- Fallo crítico durante el inicio del servidor → `fatal`.

### Comportamiento según el entorno

El nivel de logging se configura mediante la variable:

```env
LOG_LEVEL=debug
```

Si no se especifica, la aplicación utiliza:

- `debug` en desarrollo.
- `info` en los demás entornos.

Esto permite controlar la cantidad de información registrada según las necesidades de cada entorno.

### Persistencia de logs

Los logs se almacenan en:

```text
logs/
```

Se generan archivos diarios mediante `winston-daily-rotate-file`:

```text
logs/combined-YYYY-MM-DD.log
logs/error-YYYY-MM-DD.log
```

El archivo `combined` contiene los eventos generales registrados por la aplicación.

El archivo `error` está destinado a los niveles:

```text
error
fatal
```

### Rotación de archivos

Los archivos utilizan rotación diaria.

La configuración actual conserva:

- Logs generales durante 14 días.
- Logs de errores durante 30 días.

Esto evita que los archivos de log crezcan indefinidamente.

### Endpoint de prueba del logger

Para comprobar todos los niveles disponibles se implementó:

```http
GET /api/logger/test
```

El endpoint ejecuta:

```text
debug
http
info
warning
error
fatal
```

Ejemplo:

```http
GET http://localhost:3000/api/logger/test
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "Todos los niveles de logging fueron ejecutados correctamente"
}
```

El endpoint es exclusivamente de prueba y los mensajes `error` y `fatal` generados por él son intencionales.

### Integración con el manejo global de errores

El logger está integrado con:

```text
src/middlewares/errorHandler.js
```

Los errores de validación y de negocio se registran como eventos de advertencia cuando corresponde, mientras que los errores inesperados se registran como errores.

Los errores críticos producidos durante el inicio del servidor se registran mediante `fatal`.

El flujo general es:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Error
   ↓
errorHandler
   ↓
Winston
   ↓
Console + archivos de log
```

### Archivos excluidos de Git

Los archivos generados durante la ejecución no deben subirse al repositorio.

El `.gitignore` contempla:

```gitignore
/node_modules/
/logs/

.env
.env.test
```

De esta manera se evita versionar dependencias instaladas, logs generados y variables de entorno locales.

Los archivos `.env.example` y `.env.test.example` se mantienen como referencia de configuración.

---

# 🧩 Constantes

Los valores correspondientes al dominio se encuentran centralizados en:

```text
src/constants/index.js
```

Los objetos utilizan `Object.freeze()` para evitar modificaciones accidentales durante la ejecución.

Actualmente se centralizan:

```text
USER_ROLE
PRODUCT_STATUS
ORDER_STATUS
ORDER_PRIORITY
DELIVERY_STATUS
DELIVERY_PRIORITY
ERROR_TYPES
```

Esto evita utilizar strings mágicos repetidos en diferentes partes de la aplicación.

---

# 🧠 ¿Por qué separar Service y Repository?

La separación permite que cada capa tenga una responsabilidad específica.

El **Repository** se ocupa exclusivamente del acceso a datos:

- Consultas.
- Filtros.
- Proyecciones.
- `populate`.
- Operaciones de persistencia.

El **Service** se ocupa de:

- Reglas de negocio.
- Validaciones.
- Comprobaciones previas.
- Coordinación entre repositories.
- Manejo de errores de dominio.

De esta manera, el Controller no necesita conocer cómo se almacenan los datos y el Repository no necesita conocer las reglas de negocio.

---

# 🧠 ¿Por qué centralizar los errores?

El manejo centralizado permite evitar respuestas inconsistentes.

Sin un middleware global, cada Controller podría devolver estructuras diferentes.

Con el sistema implementado, los errores siguen una estructura común:

```json
{
  "status": "error",
  "error": "ERROR_TYPE",
  "message": "Mensaje del error",
  "cause": "Información adicional"
}
```

Esto facilita:

- El mantenimiento.
- La depuración.
- La integración con clientes frontend.
- La identificación de errores.
- La evolución futura de la API.

---

# 🔄 Flujo de una petición exitosa

Ejemplo para obtener productos:

```text
GET /api/products
       ↓
Product Route
       ↓
Product Controller
       ↓
Product Service
       ↓
Product Repository
       ↓
Product Model
       ↓
MongoDB
```

El resultado vuelve siguiendo el camino inverso hasta llegar al cliente HTTP.

---

# 🔄 Flujo de una petición con error

Cuando ocurre un error de negocio:

```text
GET /api/users/:id
       ↓
User Route
       ↓
User Controller
       ↓
User Service
       ↓
CustomError
       ↓
next(error)
       ↓
errorHandler
       ↓
HTTP Response
```

El Controller no necesita conocer cómo debe responder el error.

El middleware global se encarga de transformar el error en una respuesta HTTP uniforme.

---

# 🔒 Seguridad y buenas prácticas

- Las variables de entorno no se almacenan en Git.
- `.env` y `.env.test` están incluidos en `.gitignore`.
- Se proporcionan `.env.example` y `.env.test.example` sin credenciales reales.
- Los Controllers no acceden directamente a Mongoose.
- Los Services contienen la lógica de negocio.
- Los Repositories encapsulan el acceso a MongoDB.
- Los valores del dominio se centralizan mediante constantes.
- Los tipos de error se centralizan mediante `ERROR_TYPES`.
- Los errores de negocio utilizan `CustomError`.
- Los errores se procesan mediante un middleware global.
- Los modelos se utilizan para definir los esquemas de Mongoose.
- Las respuestas de error mantienen una estructura uniforme.
- Las pruebas funcionales utilizan una base de datos independiente.
- La base de datos de testing se limpia antes de cada prueba.
- Las solicitudes JSON tienen un límite máximo de 1 MB.

---

# 🐳 Despliegue con Docker

La aplicación puede ejecutarse dentro de un contenedor Docker, utilizando una imagen basada en Node.js 22 Alpine.

El Dockerfile instala las dependencias de producción, configura los directorios necesarios y ejecuta la aplicación con el usuario no privilegiado `node`.

### Construcción de la imagen

Desde la raíz del proyecto, ejecutar:

```bash
docker build -t shipnow-api .
```

Este comando construye la imagen Docker de la API utilizando el `Dockerfile`.

### Ejecución del contenedor

Para iniciar la aplicación en modo producción:

```bash
docker run -d \
  --name shipnow-container \
  -p 3001:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/shipnow \
  -e JWT_SECRET="TU_SECRETO_SEGURO" \
  -e LOG_LEVEL=info \
  -v shipnow-uploads:/app/uploads \
  -v shipnow-logs:/app/logs \
  shipnow-api
```

**Configuración de puertos:**

- Puerto 3000: puerto interno del contenedor.
- Puerto 3001: puerto utilizado desde el equipo local.

Las variables de entorno permiten configurar la conexión a MongoDB, el entorno de ejecución y la seguridad de la aplicación.

Los volúmenes permiten conservar los archivos subidos y los logs entre recreaciones del contenedor.

### Ejecución con usuario no privilegiado

El Dockerfile configura la propiedad de los directorios necesarios y utiliza:

```dockerfile
USER node
```

Esto evita ejecutar la aplicación como usuario root dentro del contenedor.

### Verificación del contenedor

Para comprobar que el contenedor está ejecutándose:

```bash
docker ps
```

Para consultar los registros de ejecución:

```bash
docker logs shipnow-container
```

El contenedor incorpora un `HEALTHCHECK` que verifica periódicamente el endpoint `/api/health`.

Su estado puede consultarse mediante:

```bash
docker ps
```

Docker mostrará el estado `healthy` cuando la verificación sea satisfactoria.

### Acceso a la API

Con el contenedor en ejecución, se puede acceder al endpoint de monitoreo desde:

```text
http://localhost:3001/api/health
```

La documentación Swagger y las rutas internas de testing y mocking no están disponibles en producción.

### Detener y eliminar el contenedor

Para detenerlo:

```bash
docker stop shipnow-container
```

Para eliminarlo:

```bash
docker rm shipnow-container
```

### Archivos excluidos de la imagen

El archivo `.dockerignore` evita copiar elementos innecesarios o sensibles al contexto de construcción, como:

- `node_modules`
- Archivos `.env`
- Logs
- Archivos subidos (`uploads`)
- Archivos de Git
- Reportes de cobertura de tests
- Carpeta `tests`

Esto permite reducir el tamaño de la imagen y evitar incluir información sensible o archivos que no son necesarios para ejecutar la aplicación.

### Persistencia de archivos y logs

Los directorios `uploads` y `logs` se crean dentro del contenedor.

Si el contenedor se elimina y no se utilizan volúmenes, los archivos almacenados allí pueden perderse.

Para conservarlos entre recreaciones del contenedor, se recomienda utilizar volúmenes Docker:

```text
shipnow-uploads:/app/uploads
shipnow-logs:/app/logs
```

---

# 📌 Estado de implementación — Módulo 8

### Rendimiento y escalabilidad

- [x] Paginación de usuarios.
- [x] Paginación de productos.
- [x] Paginación de órdenes.
- [x] Paginación de entregas.
- [x] Paginación de entregas por repartidor.
- [x] Límites máximos de registros por consulta.
- [x] Validación de parámetros `page` y `limit`.
- [x] Límite máximo de 100 registros por consulta.
- [x] Filtros combinables en los endpoints correspondientes.
- [x] Metadatos de paginación en las respuestas.

### Configuración y monitoreo

- [x] Variables de entorno centralizadas y validadas.
- [x] Configuración diferenciada para desarrollo, testing y producción.
- [x] Nivel de logging configurable mediante `LOG_LEVEL`.
- [x] Endpoint de health check (`/api/health`).
- [x] Restricción de Swagger, mocks y logger en producción.

### Docker

- [x] Dockerfile y `.dockerignore`.
- [x] Construcción de imagen Docker.
- [x] Ejecución de la API en un contenedor.
- [x] Ejecución con usuario no privilegiado `node`.
- [x] Health check del contenedor.
- [x] Verificación del endpoint de salud en producción.
- [x] Exclusión de la carpeta `tests` de la imagen.
- [x] Documentación de persistencia mediante volúmenes.

### Arquitectura

- [x] Arquitectura Controller-Service-Repository.
- [x] Separación de Routes, Controllers, Services y Repositories.
- [x] Acceso a MongoDB encapsulado en Repositories.
- [x] Configuración de entorno centralizada.
- [x] Validación de variables de entorno.
- [x] Constantes inmutables.
- [x] `.env.example`.
- [x] `.gitignore`.

### Mocking

- [x] Sistema de mocking con Faker.
- [x] Mocking de usuarios.
- [x] Mocking de repartidores.
- [x] Mocking de órdenes.
- [x] Mocking de entregas.
- [x] Router específico `/api/mocks`.
- [x] Endpoint de generación sin persistencia.
- [x] Endpoint de seed para carga controlada.
- [x] Relaciones entre usuarios, órdenes y entregas.
- [x] Validación de cantidades.
- [x] Validación de cantidades negativas.
- [x] Validación de cantidades superiores al máximo.
- [x] Contraseñas persistidas mediante bcrypt.

### Manejo profesional de errores

- [x] Capa centralizada de errores.
- [x] `CustomError`.
- [x] `errorDictionary`.
- [x] `ERROR_TYPES`.
- [x] Middleware global `errorHandler`.
- [x] Propagación de errores mediante `next(error)`.
- [x] Errores de usuario inexistente.
- [x] Errores de orden inexistente.
- [x] Errores de delivery inexistente.
- [x] Errores de estados inválidos.
- [x] Errores de validación.
- [x] Errores de cantidad inválida.
- [x] Errores de generación de mocks.
- [x] Errores de persistencia de mocks.
- [x] Manejo controlado de `CastError` de Mongoose.
- [x] Manejo de cuerpos JSON superiores a 1 MB.
- [x] Respuesta HTTP 413 para cuerpos demasiado grandes.
- [x] Código de error `PAYLOAD_TOO_LARGE`.
- [x] Respuestas de error uniformes.
- [x] Pruebas de casos inválidos.

### Logging y monitoreo básico

- [x] Winston como sistema centralizado de logging.
- [x] Niveles `debug`, `http`, `info`, `warning`, `error` y `fatal`.
- [x] Configuración centralizada del logger.
- [x] Comportamiento según el entorno y `LOG_LEVEL`.
- [x] Registro de inicio del servidor.
- [x] Registro de conexión a MongoDB.
- [x] Registro de generación de mocks.
- [x] Registro de seed.
- [x] Registro de cantidades inválidas.
- [x] Registro de rutas inexistentes.
- [x] Integración con `errorHandler`.
- [x] Persistencia de logs en archivos.
- [x] Rotación diaria de logs.
- [x] Archivo de errores separado.
- [x] Endpoint `/api/logger/test`.
- [x] Directorio `logs/` excluido mediante `.gitignore`.

### Testing funcional

- [x] Instalación y configuración de Mocha.
- [x] Configuración de Chai.
- [x] Integración de Supertest.
- [x] Script `npm test`.
- [x] Separación entre `app.js` y `server.js`.
- [x] Entorno de testing independiente.
- [x] Base de datos exclusiva `shipnow_test`.
- [x] Limpieza de colecciones antes de cada prueba.
- [x] Cierre de conexión al finalizar los tests.
- [x] Pruebas funcionales de usuarios.
- [x] Pruebas funcionales de productos.
- [x] Pruebas funcionales de órdenes.
- [x] Pruebas funcionales de entregas.
- [x] Pruebas de generación y persistencia de mocks.
- [x] Pruebas del endpoint del logger.
- [x] Pruebas de acceso a Swagger.
- [x] Validación de respuestas exitosas y errores.
- [x] Pruebas de validación de paginación.
- [x] Prueba del límite de tamaño del body JSON.
- [x] Ejecución de la suite completa.

**Última ejecución registrada:**

```text
58 passing
0 failing
```

---

# 👩‍💻 Autora

**Liliana Beatriz Escobar**

Proyecto realizado como parte de la formación en desarrollo Backend III en Coderhouse.