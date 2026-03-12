
import { 
  Home, Monitor, Activity, FileText, Camera, Eye, AlertTriangle, Shield, 
  Bell, Network, HardDrive, Wifi, Server, Cloud, Lock, Globe, Settings, User,
  Code2, BarChart3
} from 'lucide-react';
import { MenuItem, DeviceStatus, Device, Incident, Vulnerability, Policy, Severity, LogEntry } from '../../types';

export const COLORS = {
  wine: '#7A0C0C',
  wineLight: '#8B1E1E',
  bone: '#F7F5F2',
  text: '#1A1A1A',
  grey: '#F3F4F6',
  critical: '#DC2626',
  high: '#F97316',
  medium: '#FACC15',
  low: '#10B981'
};

export const POLICIES: Policy[] = [
  // SEGURIDAD / ENDPOINT (GPO Style)
  { id: 'p1', name: 'Bloqueo de USB Storage', description: 'Desactiva montado de dispositivos de almacenamiento masivo externos.', category: 'Seguridad', enabled: true },
  { id: 'p2', name: 'IPS Activo Nivel 5', description: 'Prevención de intrusiones en tiempo real mediante análisis de paquetes de kernel.', category: 'Seguridad', enabled: true },
  { id: 'p3', name: 'Anti-Ransomware Heurístico', description: 'Detección de patrones de cifrado anómalos y bloqueo de hilos de ejecución.', category: 'Seguridad', enabled: true },
  { id: 'p4', name: 'Escaneo de Rootkits al Inicio', description: 'Análisis profundo de sectores de arranque MBR/GPT antes del OS load.', category: 'Seguridad', enabled: false },
  { id: 'p5', name: 'Firewall de Host - Modo Strict', description: 'Bloqueo total de tráfico entrante no firmado por certificados BWP.', category: 'Seguridad', enabled: true },
  { id: 'p6', name: 'Control de Ejecución PowerShell', description: 'Solo permite scripts firmados digitalmente por la autoridad SOC.', category: 'Seguridad', enabled: true },
  { id: 'p7', name: 'Protección de Memoria LSASS', description: 'Evita el volcado de credenciales de la memoria del sistema (Credential Guard).', category: 'Seguridad', enabled: true },
  { id: 'p8', name: 'Aislamiento de Navegador (VDI)', description: 'Ejecuta navegadores en contenedores aislados del sistema de archivos local.', category: 'Seguridad', enabled: false },
  { id: 'p9', name: 'Bloqueo de Ejecutables en Temp', description: 'Previene la ejecución de binarios en carpetas de usuario temporales.', category: 'Seguridad', enabled: true },
  { id: 'p10', name: 'Análisis de Entropía de Disco', description: 'Monitorea el cambio masivo de firmas de archivos en tiempo real.', category: 'Seguridad', enabled: true },

  // IDENTIDAD Y ACCESO
  { id: 'p11', name: 'MFA Obligatorio SOC-Login', description: 'Requiere segundo factor para cualquier acción administrativa en el agente.', category: 'Identidad', enabled: true },
  { id: 'p12', name: 'Complejidad de Passwords NIST', description: 'Fuerza contraseñas de min 14 caracteres con rotación cada 90 días.', category: 'Identidad', enabled: true },
  { id: 'p13', name: 'Bloqueo por Reintentos Fallidos', description: 'Bloquea el nodo tras 3 intentos fallidos de login local.', category: 'Identidad', enabled: true },
  { id: 'p14', name: 'Sesión Remota Autocerrada', description: 'Cierra sesiones RDP/SSH inactivas tras 15 minutos.', category: 'Identidad', enabled: true },
  { id: 'p15', name: 'Restricción de Horario SOC', description: 'Solo permite logueo de analistas en horarios de oficina configurados.', category: 'Identidad', enabled: false },
  { id: 'p16', name: 'Privilegios Mínimos (JEA)', description: 'Just Enough Administration: comandos específicos según el rol del usuario.', category: 'Identidad', enabled: true },
  { id: 'p17', name: 'Auditoría de Creación de Usuarios', description: 'Alerta inmediata al SOC si se crea un usuario local nuevo.', category: 'Identidad', enabled: true },
  { id: 'p18', name: 'Bloqueo de Cuentas Guest', description: 'Desactiva permanentemente la cuenta de invitado en todos los nodos.', category: 'Identidad', enabled: true },
  { id: 'p19', name: 'Certificado de Identidad de Nodo', description: 'Firma de tráfico de red con certificado único por máquina.', category: 'Identidad', enabled: false },
  { id: 'p20', name: 'Validación Biométrica Requerida', description: 'Para cambios en la configuración de seguridad física.', category: 'Identidad', enabled: false },

  // RED Y COMUNICACIONES
  { id: 'p21', name: 'Port Knocking Security', description: 'Oculta puertos de administración tras secuencias de paquetes específicas.', category: 'Red', enabled: false },
  { id: 'p22', name: 'DNS Filtering Corporativo', description: 'Bloquea dominios conocidos de C&C y Phishing a nivel de resolución.', category: 'Red', enabled: true },
  { id: 'p23', name: 'Túnel VPN Always-On', description: 'Fuerza la conexión a la red corporativa para todo tráfico externo.', category: 'Red', enabled: true },
  { id: 'p24', name: 'Detección de ARP Spoofing', description: 'Monitorea la tabla ARP para evitar ataques Man-in-the-Middle.', category: 'Red', enabled: true },
  { id: 'p25', name: 'Limitación de Ancho de Banda', description: 'Controla el consumo de datos en nodos no críticos para evitar exfiltración.', category: 'Red', enabled: false },
  { id: 'p26', name: 'Bloqueo de Protocolos Legacy', description: 'Desactiva Telnet, FTP y SMB v1 en toda la red.', category: 'Red', enabled: true },
  { id: 'p27', name: 'Escaneo de Vulnerabilidades IP', description: 'Análisis mensual programado de puertos abiertos.', category: 'Red', enabled: true },
  { id: 'p28', name: 'Aislamiento de VLAN Automático', description: 'Mueve nodos infectados a una red de cuarentena aislada.', category: 'Red', enabled: true },
  { id: 'p29', name: 'Inspección de Tráfico SSL/TLS', description: 'Deep Packet Inspection para detectar payloads en tráfico cifrado.', category: 'Red', enabled: false },
  { id: 'p30', name: 'Control de Dispositivos Bluetooth', description: 'Desactiva el stack de radio para evitar ataques de proximidad.', category: 'Red', enabled: true },

  // DATOS Y PRIVACIDAD
  { id: 'p31', name: 'Cifrado de Disco AES-256', description: 'Fuerza BitLocker o LUKS en todos los dispositivos finales.', category: 'Datos', enabled: true },
  { id: 'p32', name: 'Data Loss Prevention (DLP)', description: 'Monitorea copia de archivos con patrones de tarjetas de crédito o IDs.', category: 'Datos', enabled: true },
  { id: 'p33', name: 'Borrado Remoto de Emergencia', description: 'Habilita la capacidad de Wipe total ante robo de equipo.', category: 'Datos', enabled: false },
  { id: 'p34', name: 'Etiquetado de Documentos SOC', description: 'Añade metadatos de clasificación de seguridad a archivos creados.', category: 'Datos', enabled: false },
  { id: 'p35', name: 'Bloqueo de Captura de Pantalla', description: 'En aplicaciones marcadas como confidenciales.', category: 'Datos', enabled: true },
  { id: 'p36', name: 'Control de Portapapeles Remoto', description: 'Evita copiar datos fuera de la sesión RDP/Citrix.', category: 'Datos', enabled: true },
  { id: 'p37', name: 'Shadow Copy Automático', description: 'Crea respaldos locales de archivos antes de su edición.', category: 'Datos', enabled: true },
  { id: 'p38', name: 'Auditoría de Acceso a SQL', description: 'Registra toda consulta realizada a bases de datos de producción.', category: 'Datos', enabled: true },
  { id: 'p39', name: 'Restricción de Impresión', description: 'Solo permite imprimir en impresoras corporativas verificadas.', category: 'Datos', enabled: false },
  { id: 'p40', name: 'Anonimización de Logs', description: 'Elimina PII de los registros antes de enviarlos al cloud.', category: 'Datos', enabled: true },

  // SISTEMA Y CUMPLIMIENTO
  { id: 'p41', name: 'Parcheo Automático Crítico', description: 'Instala actualizaciones de seguridad de Windows/Linux en < 24h.', category: 'Sistema', enabled: true },
  { id: 'p42', name: 'Inmutable System Core', description: 'Evita modificaciones en archivos de configuración del sistema operativo.', category: 'Sistema', enabled: false },
  { id: 'p43', name: 'Agent Self-Defense', description: 'Previene la detención o desinstalación del agente BWP sin token maestro.', category: 'Sistema', enabled: true },
  { id: 'p44', name: 'App Whitelisting Strict', description: 'Solo permite la ejecución de software firmado por el SOC.', category: 'Sistema', enabled: true },
  { id: 'p45', name: 'Sincronización de Tiempo NTP', description: 'Asegura que todos los logs tengan el timestamp exacto del SOC.', category: 'Sistema', enabled: true },
  { id: 'p46', name: 'Monitor de Temperatura de CPU', description: 'Alerta sobre posible minado de criptomonedas oculto.', category: 'Sistema', enabled: true },
  { id: 'p47', name: 'Hardening de SSH Config', description: 'Desactiva login de Root y fuerza llaves RSA 4096.', category: 'Sistema', enabled: true },
  { id: 'p48', name: 'Compliance HIPAA/GDPR', description: 'Set de reglas preconfiguradas para auditorías de salud.', category: 'Cumplimiento', enabled: false },
  { id: 'p49', name: 'Reporte de Inventario Diario', description: 'Consolidado de hardware y software instalado en el parque.', category: 'Cumplimiento', enabled: true },
  { id: 'p50', name: 'Verificación de Integridad de BIOS', description: 'Chequeo de firmas de firmware UEFI contra base de datos BWP.', category: 'Sistema', enabled: true },
  { id: 'p51', name: 'Detección de Virtualización', description: 'Alerta si el agente se corre dentro de una VM no declarada.', category: 'Sistema', enabled: true },
  { id: 'p52', name: 'Control de Servicios Críticos', description: 'Reinicia automáticamente servicios de defensa si fallan.', category: 'Sistema', enabled: true },
  { id: 'p53', name: 'Bloqueo de Modos de Desarrollador', description: 'Desactiva ADB y herramientas de debugeo en endpoints.', category: 'Sistema', enabled: true },
  { id: 'p54', name: 'Políticas de Grupo Force Update', description: 'Refresca las GPOs cada 30 minutos obligatoriamente.', category: 'Sistema', enabled: true },
  { id: 'p55', name: 'Alerta de Bajo Espacio en Disco', description: 'Previene fallos en la rotación de logs de seguridad.', category: 'Sistema', enabled: true },
];

export const MENU_ITEMS: MenuItem[] = [
  { name: 'Resumen', path: '/overview', icon: Home },
  { name: 'Equipos PC', path: '/devices/pc', icon: Monitor, badge: 5 },
  
  { name: 'Monitoreo', path: '/monitoring', icon: Activity },
  { name: 'Activity Graph', path: '/activity-graph', icon: BarChart3, alert: true },
  { name: 'Equipos Globales', path: '/monitoring', icon: Globe, badge: 12 },
  { name: 'Scripts Globales', path: '/scripts-global', icon: Code2, alert: true },
  { name: 'Executive Summary', path: '/dashboard/monitoring/summary', icon: FileText },

  { name: 'Cámaras', path: '/cameras', icon: Camera, badge: 2 },
  { name: 'Registros', path: '/dashboard/logs', icon: Eye },

  { name: 'Incidentes', path: '/dashboard/incidents', icon: AlertTriangle, badge: 3, alert: true },
  { name: 'Lista de incidentes', path: '/dashboard/incidents/list', icon: AlertTriangle },
  { name: 'Categorías', path: '/dashboard/incidents/categories', icon: Shield },
  { name: 'Smart Views', path: '/dashboard/incidents/smart-views', icon: Eye },
  { name: 'Exportar CSV', path: '/dashboard/incidents/export', icon: FileText },
  { name: 'Notificaciones', path: '/dashboard/incidents/notifications', icon: Bell },

  { name: 'Red', path: '/dashboard/network', icon: Network, badge: 3, alert: true },

  { name: 'WiFi', path: '/wifi', icon: Wifi },
  { name: 'Servidores', path: '/servers', icon: Server },
  { name: 'Integración AWS EC2', path: '/aws', icon: Cloud },
  { name: 'Integración Cloud', path: '/cloud-multi', icon: Globe },

  { name: 'Seguridad', path: '/security', icon: Lock },
  { name: 'Vulnerabilidades', path: '/vulnerabilities', icon: Shield, badge: 8, alert: true },
  
  { name: 'Perfil', path: '/profile', icon: User },
  { name: 'Configuraciones', path: '/settings', icon: Settings },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: 'LOG-001', timestamp: '2024-05-20 14:30:05', category: 'SCAN', severity: 'INFO', message: 'Escaneo de vulnerabilidades completado en CEO-LAPTOP-01. 2 CVE detectados.', origin: 'Security-Engine', user: 'System' },
  { id: 'LOG-002', timestamp: '2024-05-20 14:28:12', category: 'USER', severity: 'NOTICE', message: 'Nueva cámara IP registrada: CAM-ENTRANCE-A1.', origin: 'Web-Dashboard', user: 'Admin' },
  { id: 'LOG-003', timestamp: '2024-05-20 14:25:00', category: 'SECURITY', severity: 'CRITICAL', message: 'Intento de fuerza bruta detectado en SRV-DATA-DB. IP bloqueada permanentemente.', origin: 'BWP-Agent-v2.5', user: 'System' },
  { id: 'LOG-004', timestamp: '2024-05-20 14:20:44', category: 'NETWORK', severity: 'WARNING', message: 'Latencia inusual detectada en segmento Seguridad Perimetral (>200ms).', origin: 'Network-Monitor', user: 'System' },
];

export const MOCK_DEVICES: Device[] = [
  { 
    id: '1', name: 'CEO-LAPTOP-01', type: 'PC', os: 'Windows 11 Enterprise', ip: '192.168.1.15', 
    status: DeviceStatus.CRITICAL, cpu: 12, ram: 45, disk: 78, network: '1.2 Mbps', agentVersion: 'v2.5.4',
    latency: 12, lastUpdate: '2024-05-20 14:05', protectionActive: true, 
    department: 'Administración', vulnerabilities: ['CVE-2024-21413', 'CVE-2023-44487'],
    policies: ['p1', 'p3', 'p5', 'p8', 'p10'], lastOffline: '2024-05-19 23:30'
  },
  { 
    id: 'PC-2', name: 'DEV-STATION-04', type: 'PC', os: 'Ubuntu 22.04 LTS', ip: '192.168.10.55', 
    status: DeviceStatus.ONLINE, cpu: 65, ram: 32, disk: 44, network: '450 Mbps', agentVersion: 'v2.5.4',
    latency: 5, lastUpdate: 'Just ahora', protectionActive: true, 
    department: 'IT', vulnerabilities: [],
    policies: ['p2', 'p3', 'p55'], lastOffline: 'Nunca'
  },
  { 
    id: 'PC-3', name: 'SALES-WIN-10', type: 'PC', os: 'Windows 10 Pro', ip: '192.168.1.102', 
    status: DeviceStatus.RISK, cpu: 88, ram: 92, disk: 95, network: '15 Mbps', agentVersion: 'v2.4.1 (Old)',
    latency: 22, lastUpdate: 'Hace 5 min', protectionActive: true, 
    department: 'Ventas', vulnerabilities: ['CVE-2023-44487'],
    policies: ['p1', 'p5'], lastOffline: '2024-05-20 09:00'
  },
  { 
    id: 'PC-4', name: 'HR-PC-LAPTOP', type: 'PC', os: 'Windows 11 Home', ip: '192.168.1.110', 
    status: DeviceStatus.ONLINE, cpu: 10, ram: 25, disk: 30, network: '2 Mbps', agentVersion: 'v2.5.4',
    latency: 18, lastUpdate: 'Just ahora', protectionActive: true, 
    department: 'Administración', vulnerabilities: [],
    policies: ['p1', 'p2', 'p3', 'p5', 'p45', 'p55'], lastOffline: 'Ayer'
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  { 
    id: 'INC-2024-001', 
    title: 'Ransomware Detection Pattern', 
    description: 'Se detectó una ráfaga inusual de escrituras cifradas en el volumen /var/lib/mysql. Patrón coincide con LockBit 3.0.',
    severity: Severity.CRITICAL, 
    target: 'CEO-LAPTOP-01', 
    targetType: 'PC',
    department: 'Administración',
    timestamp: '2024-05-20 12:45:01', 
    status: 'Blocked',
    attackerIp: '45.12.88.21'
  },
];

export const MOCK_VULNERABILITIES: Vulnerability[] = [
  { id: 'VULN-001', cve: 'CVE-2024-21413', cvss: 9.8, severity: Severity.CRITICAL, target: 'CEO-LAPTOP-01', status: 'Open' },
  { id: 'VULN-002', cve: 'CVE-2023-44487', cvss: 7.5, severity: Severity.HIGH, target: 'SALES-WIN-10', status: 'In Risk' },
];
