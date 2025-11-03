# Taekwondo Dojang App

Aplicación base construida con Expo + React Native para gestionar clases de Taekwondo, alumnos y asistencia diaria. La interfaz se organiza alrededor de una navegación lateral (drawer) que simula el comportamiento de Google Keep para tomar notas rápidas de cada clase.

## Características principales

- **Drawer principal** con accesos rápidos a las secciones de Clases, Alumnos y Asistencia.
- **Gestión de clases** con fecha, descripción y lista de entrenamientos a modo de notas.
- **Registro de alumnos** con información básica para el dojang.
- **Toma de asistencia** para cada clase usando interruptores intuitivos.
- **Persistencia con SQLite** mediante `expo-sqlite` (API legacy) para facilitar la evolución hacia features más complejas.

## Estructura del proyecto

```
App.tsx                # Punto de entrada. Inicializa la DB y monta el Drawer
index.ts               # Registro estándar de Expo
src/
  components/          # Componentes reutilizables (cabecera, estados vacíos)
  database/            # Cliente SQLite y repositorios de datos
  navigation/          # Implementación del DrawerNavigation base
  screens/             # Pantallas: Clases, Alumnos, Asistencia
  types/               # Tipado auxiliar para SQLite
assets/                # Recursos estáticos generados por Expo
```

### Detalle de la capa de datos (SQLite)

Se crean tres tablas principales en `src/database/client.ts`:

- `classes`: título, descripción, fecha (`class_date`) y entrenamientos (JSON).
- `students`: nombre completo, cinturón y notas.
- `attendance`: vínculo entre clase y alumno con estado de asistencia.

Los repositorios (`classRepository.ts`, `studentRepository.ts`, `attendanceRepository.ts`) encapsulan las operaciones CRUD y devuelven datos tipados para las pantallas. Este enfoque permite sustituir fácilmente la capa de persistencia por otra (REST, GraphQL, etc.).

## Conceptos de React utilizados

- **Componentes funcionales** (`ClassesScreen`, `StudentsScreen`, `AttendanceScreen`), que reciben props y devuelven JSX.
- **Hooks de estado** (`useState`) para manejar formularios, mensajes y colecciones recuperadas de la base de datos.
- **Efectos** (`useEffect`) para cargar datos cuando la pantalla se monta o cuando cambia la clase seleccionada.
- **Memoización** (`useMemo`) en la pantalla de asistencia para derivar la clase activa sin recalcular en cada render.
- **Componentización** para reutilizar elementos de UI (`AppHeader`, `EmptyState`) y mantener el código limpio.
- **Estilos con `StyleSheet.create`** para centralizar la paleta y el espaciado.

## Cómo ejecutar el proyecto

1. **Instalar dependencias**

   ```bash
   npm install
   npx expo install expo-sqlite
   ```

   > Debido a la restricción de red de este entorno no se pudieron descargar los paquetes de `@react-navigation`. El proyecto incluye un drawer propio; si deseas reemplazarlo por `@react-navigation/drawer`, instala las dependencias oficiales (`@react-navigation/native`, `@react-navigation/drawer`, `react-native-gesture-handler`, etc.) antes de ejecutar Expo.

2. **Levantar Expo**

   ```bash
   npm run start
   ```

   Sigue las instrucciones de la CLI para abrir la app en un emulador o en Expo Go.

## Extender la aplicación

- **Más atributos**: agrega columnas a las tablas desde `initializeDatabase` y expone la información a través de los repositorios.
- **Reportes**: crea nuevas pantallas reutilizando el Drawer para generar estadísticas (por ejemplo, asistencia mensual).
- **Sincronización en la nube**: reemplaza el repositorio SQLite por llamadas a una API manteniendo la misma interfaz de funciones.
- **UI adaptable**: extrae componentes de formulario si deseas reutilizarlos (inputs, chips, etc.).

## Buenas prácticas aplicadas

- Separación clara entre vista, navegación y datos.
- Tipado estricto con TypeScript para prevenir errores frecuentes.
- Mensajes de feedback para el usuario (errores, confirmaciones, estados vacíos).
- Componentes diseñados con estilos neutrales para personalizarlos con la paleta de tu dojang.

¡Listo! Con esta base puedes seguir expandiendo la aplicación para cubrir necesidades más avanzadas de tu escuela de Taekwondo.
