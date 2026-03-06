# Checklist de pruebas manuales — RBAC

## admin_spain

| Caso | Acción | Esperado |
|------|--------|----------|
| 1 | Login como admin_spain | Acceso al dashboard |
| 2 | Seleccionar MCI SPAIN | Ver menú inventario + badge sin "Solo lectura" |
| 3 | Crear activo en MCI SPAIN | Crear correctamente |
| 4 | Editar activo en MCI SPAIN | Editar correctamente |
| 5 | Eliminar activo en MCI SPAIN | Eliminar correctamente (mover a papelera) |
| 6 | Seleccionar MCI LATAM | Ver menú inventario |
| 7 | Crear activo en MCI LATAM | Crear correctamente |
| 8 | Editar activo en MCI LATAM | Editar correctamente |
| 9 | Eliminar activo en MCI LATAM | Eliminar correctamente |
| 10 | Navegar a /users | Ver lista de usuarios |
| 11 | Navegar a /admin | Ver panel administrador |

## user_latam

| Caso | Acción | Esperado |
|------|--------|----------|
| 1 | Login como user_latam | Acceso al dashboard |
| 2 | Seleccionar MCI SPAIN | Ver menú inventario + badge "Solo lectura (MCI Spain)" |
| 3 | En MCI SPAIN: botón "Agregar Activo" | Deshabilitado u oculto |
| 4 | En MCI SPAIN: lista de activos | Ver lista, exportar OK |
| 5 | En MCI SPAIN: detalle de activo | Sin botones Editar/Eliminar |
| 6 | En MCI SPAIN: URL directa /assets/new | Redirect a / con toast "Solo lectura" |
| 7 | En MCI SPAIN: URL directa /assets/id/X/edit | Redirect a detalle con toast "Solo lectura" |
| 8 | Seleccionar MCI LATAM | Ver menú inventario sin badge "Solo lectura" |
| 9 | Crear activo en MCI LATAM | Crear correctamente |
| 10 | Editar activo en MCI LATAM | Editar correctamente |
| 11 | Eliminar activo en MCI LATAM | Eliminar correctamente |
| 12 | En sidebar | NO ver enlaces Usuarios ni Administrador |
| 13 | Navegar a /users (URL directa) | Redirect a /dashboard |
| 14 | Navegar a /admin (URL directa) | Redirect a /dashboard |

## Fallback (sin role o error)

| Caso | Acción | Esperado |
|------|--------|----------|
| 1 | Role null (loading/error) | Bloquear escritura, mostrar solo lectura |
