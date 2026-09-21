# TheHarvester Pro

Interfaz web moderna para [theHarvester](https://github.com/laramies/theHarvester), construida con Vue 3, Tailwind CSS y Express.js.

## Caracteristicas

- Enumeracion de subdominios, emails, IPs y ASNs
- 60+ fuentes de datos (crtsh, bing, virustotal, shodan, etc.)
- Grafo de red interactivo con D3.js
- Estadisticas por fuente y tipo
- Exportacion a JSON, CSV y TXT
- Historial de escaneos
- HackerLoader: animacion cyberpunk durante el escaneo
- DNS resolve, DNS brute force, Shodan enrichment

## Arquitectura

```
Frontend (Vue 3, puerto 5174)
    |
    v
Backend (Express, puerto 3001)
    |
    v
theHarvester REST API (puerto 5000)
```

## Requisitos

- Node.js >= 18
- Python 3.14
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (package manager)
- [theHarvester](https://github.com/laramies/theHarvester)

## Instalacion

### 1. Instalar uv (si no lo tienes)

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Instalar theHarvester

#### Opcion A: Kali Linux (paquete del sistema)

```bash
sudo apt update
sudo apt install theharvester
```

Nota: El paquete de Kali puede estar desactualizado. Para la ultima version, usa la Opcion B.

#### Opcion B: Desde codigo fuente (recomendado)

```bash
git clone https://github.com/laramies/theHarvester.git
cd theHarvester
uv sync
```

### 3. Configurar API key

```bash
export THEHARVESTER_API_KEY="$(openssl rand -hex 32)"
echo "Tu API key: $THEHARVESTER_API_KEY"
```

### 4. Iniciar theHarvester API

```bash
# Si instalaste con uv:
uv run harvestview --port 5000

# Si instalaste con apt (Kali):
harvestview --port 5000
```

### 5. Instalar dependencias del proyecto

```bash
# Backend
cd theharvester-pro/backend
npm install

# Frontend
cd ../frontend
npm install
```

## Uso

### 1. Iniciar theHarvester API (terminal 1)

```bash
cd ~/theHarvester
export THEHARVESTER_API_KEY="tu_key"
uv run harvestview --port 5000
```

### 2. Iniciar backend (terminal 2)

```bash
cd theharvester-pro/backend
npm start
```

### 3. Iniciar frontend (terminal 3)

```bash
cd theharvester-pro/frontend
npm run dev
```

### 4. Abrir en navegador

```
http://localhost:5174
```

## Screenshots (opcional)

Para capturar screenshots de subdominios, necesitas Playwright con Chromium:

```bash
cd ~/theHarvester
uv run playwright install chromium
```

En Linux, puede faltar dependencias del sistema:

```bash
uv run playwright install-deps
uv run playwright install chromium
```

## Variables de entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `THEHARVESTER_URL` | `http://localhost:5000` | URL de la API de theHarvester |
| `THEHARVESTER_API_KEY` | - | API key de theHarvester (requerido) |
| `PORT` | `3001` | Puerto del backend |

## Fuentes disponibles

| Categoria | Fuentes |
|-----------|---------|
| Search Engines | baidu, bing, duckduckgo, yahoo, mojeek, brave |
| Certificate Transparency | crtsh, certspotter, crt-name |
| DNS | dnsdumpster, hackertarget, rapiddns, commoncrawl, robtex, subdomaincenter |
| Threat Intel | otx, virustotal, dehashed, intelx, leakix, hibp |
| Scan Data | censys, shodan, shodanInternetDB, urlscan, fofa, zoomeye |
| Code | github-code, gitlab |
| Email Intel | hunter, tomba, rocketreach |
| Mobile | bevigil, hudsonrock |
| Other | waybackarchive, builtwith, sourcegraph |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/scan` | Crear escaneo |
| GET | `/api/results/:id` | Obtener resultados |
| GET | `/api/sources` | Listar fuentes |
| GET | `/api/runs` | Historial |
| POST | `/api/cancel/:id` | Cancelar escaneo |

## Stack

- Vue 3 + Vite
- Tailwind CSS
- Pinia
- D3.js
- Chart.js
- Express.js

## Licencia

MIT