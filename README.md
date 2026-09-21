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
- Python >= 3.12
- [theHarvester](https://github.com/laramies/theHarvester) instalado

## Instalacion

### 1. Instalar theHarvester

```bash
git clone https://github.com/laramies/theHarvester.git
cd theHarvester
pip install -e .
```

### 2. Configurar API key

```bash
export THEHARVESTER_API_KEY="tu_api_key_aqui"
```

### 3. Iniciar theHarvester API

```bash
harvestview --port 5000
```

### 4. Instalar backend

```bash
cd theharvester-pro/backend
npm install
```

### 5. Instalar frontend

```bash
cd theharvester-pro/frontend
npm install
```

## Uso

### 1. Iniciar theHarvester API (terminal 1)

```bash
export THEHARVESTER_API_KEY="tu_key"
harvestview --port 5000
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

## Variables de entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `THEHARVESTER_URL` | `http://localhost:5000` | URL de la API de theHarvester |
| `THEHARVESTER_API_KEY` | - | API key de theHarvester |
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

## Stack

- Vue 3 + Vite
- Tailwind CSS
- Pinia
- D3.js
- Chart.js
- Express.js

## Licencia

MIT