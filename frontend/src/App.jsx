import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  AlertOctagon, 
  Mail, 
  Settings, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Activity, 
  Sun, 
  Moon, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle,
  FileDown,
  Building,
  Calendar,
  FileText,
  Printer,
  ChevronLeftCircle,
  Percent,
  LogOut,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Send,
  CheckSquare,
  Square,
  Eye,
  RefreshCw,
  Copy,
  ExternalLink,
  Archive,
  Download
} from 'lucide-react';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';

const DEFAULT_COMPARADO_DATA = {
  corte_actual: "31 de Julio de 2026",
  corte_anterior: "31 de Julio de 2025",
  entidad: "ASSBASALUD E.S.E. Manizales",
  tipo_entidad: "IPS Pública de Baja Complejidad",
  totales: {
    saldo_2025: 5716832737.05,
    saldo_2026: 8151530735.95,
    variacion_absoluta: 2434697998.90,
    variacion_porcentaje: 42.59
  },
  conceptos: [
    {
      concepto: "SUBSIDIADO",
      saldo_2025: 2108636328.12,
      part_2025: 36.88,
      saldo_2026: 3334807358.58,
      part_2026: 40.91,
      var_abs: 1226171030.46,
      var_pct: 58.15,
      es_principal: true,
      tipo_renta: "asistencial",
      explicacion: "Renta asistencial de mayor participación. Representa más del 70% de la cartera corriente activa. Aumentó por demoras en giro corriente y glosas de aseguradoras intervenidas (Nueva EPS, Asmet Salud)."
    },
    {
      concepto: "DEUDAS DIFÍCIL COBRO",
      saldo_2025: 3579100845.16,
      part_2025: 62.61,
      saldo_2026: 4100533585.41,
      part_2026: 50.30,
      var_abs: 521432740.25,
      var_pct: 14.57,
      es_principal: false,
      tipo_renta: "historica",
      explicacion: "Acreencias atrapadas de EPS liquidadas en procesos concursales ante la Supersalud (Saludcoop, Cafesalud, Medimás, Coomeva) y facturas que superaron los 360 días de mora."
    },
    {
      concepto: "ACCIONES DE SALUD PÚBLICA (PIC)",
      saldo_2025: 383936857.00,
      part_2025: 6.72,
      saldo_2026: 1115143231.05,
      part_2026: 13.68,
      var_abs: 731206374.05,
      var_pct: 190.45,
      es_principal: false,
      tipo_renta: "convenio",
      explicacion: "Convenios PIC con Alcaldía de Manizales y DTSC. Demora en auditorías de metas de vacunación, salud mental y firmas de actas de liquidación parcial."
    },
    {
      concepto: "CONTRIBUTIVO",
      saldo_2025: 149055520.67,
      part_2025: 2.61,
      saldo_2026: 516677342.73,
      part_2026: 6.34,
      var_abs: 367621822.06,
      var_pct: 246.63,
      es_principal: false,
      tipo_renta: "asistencial",
      explicacion: "Atenciones de urgencias básicas y servicios ambulatorios a afiliados del régimen contributivo (SURA, Sanitas, Nueva EPS Contributivo) con plazos diferidos de pago."
    },
    {
      concepto: "IPS PRIVADAS",
      saldo_2025: 49821158.00,
      part_2025: 0.87,
      saldo_2026: 146370036.00,
      part_2026: 1.80,
      var_abs: 96548878.00,
      var_pct: 193.79,
      es_principal: false,
      tipo_renta: "asistencial",
      explicacion: "Servicios de apoyo diagnóstico, laboratorio clínico y traslados asistenciales con prestadores privados de la región."
    },
    {
      concepto: "OTRAS CUENTAS NO SALUD",
      saldo_2025: 30576472.00,
      part_2025: 0.53,
      saldo_2026: 38107937.16,
      part_2026: 0.47,
      var_abs: 7531465.16,
      var_pct: 24.63,
      es_principal: false,
      tipo_renta: "administrativa",
      explicacion: "Arrendamientos de espacios físicos, servicios administrativos y convenios docentes."
    },
    {
      concepto: "ARL",
      saldo_2025: 0.00,
      part_2025: 0.00,
      saldo_2026: 5846640.00,
      part_2026: 0.07,
      var_abs: 5846640.00,
      var_pct: 100.00,
      es_principal: false,
      tipo_renta: "asistencial",
      explicacion: "Atenciones de accidentes laborales y contingencias radicadas ante aseguradoras de riesgos laborales (Positiva, Sura)."
    },
    {
      concepto: "PPNA",
      saldo_2025: 0.00,
      part_2025: 0.00,
      saldo_2026: 1939000.00,
      part_2026: 0.02,
      var_abs: 1939000.00,
      var_pct: 100.00,
      es_principal: false,
      tipo_renta: "convenio",
      explicacion: "Población Pobre No Asegurada con cargo a subsidio a la oferta del departamento."
    },
    {
      concepto: "CONVENIO INTERADMINISTRATIVO",
      saldo_2025: 934000.00,
      part_2025: 0.02,
      saldo_2026: 988729.00,
      part_2026: 0.01,
      var_abs: 54729.00,
      var_pct: 5.86,
      es_principal: false,
      tipo_renta: "convenio",
      explicacion: "Convenios con entidades públicas territoriales."
    },
    {
      concepto: "ECAT",
      saldo_2025: 0.00,
      part_2025: 0.00,
      saldo_2026: 741161.00,
      part_2026: 0.01,
      var_abs: 741161.00,
      var_pct: 100.00,
      es_principal: false,
      tipo_renta: "asistencial",
      explicacion: "Eventos Catastróficos y Accidentes de Tránsito sin póliza SOAT radicados ante ADRES."
    },
    {
      concepto: "IPS PÚBLICAS",
      saldo_2025: 957450.40,
      part_2025: 0.02,
      saldo_2026: 872603.00,
      part_2026: 0.01,
      var_abs: -84847.40,
      var_pct: -8.86,
      es_principal: false,
      tipo_renta: "asistencial",
      explicacion: "Cuentas por cobrar interinstitucionales con otros hospitales de la red pública de Caldas."
    },
    {
      concepto: "ENTIDADES RÉGIMEN ESPECIAL",
      saldo_2025: 15600.00,
      part_2025: 0.00,
      saldo_2026: 15600.00,
      part_2026: 0.00,
      var_abs: 0.00,
      var_pct: 0.00,
      es_principal: false,
      tipo_renta: "asistencial",
      explicacion: "Saldos residuales de atención a magisterio y fuerzas militares."
    },
    {
      concepto: "GIRO PARA ABONO SIN IDENTIFICAR",
      saldo_2025: -586201494.30,
      part_2025: -10.25,
      saldo_2026: -1110512487.98,
      part_2026: -13.62,
      var_abs: -524310993.68,
      var_pct: 89.44,
      es_principal: false,
      tipo_renta: "compensatoria",
      explicacion: "Cuenta compensatoria de naturaleza crédito. Fondos transferidos por Giro Directo ADRES que no han sido legalizados factura a factura debido a que las EPS no entregan las sábanas de conciliación."
    }
  ]
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState('HECTOR FABIO RAMIREZ');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Concentration Stats
  const [concentration, setConcentration] = useState(null);
  const [loadingConcentration, setLoadingConcentration] = useState(true);

  // Invoices Explorer State
  const [invoices, setInvoices] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sheetFilter, setSheetFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // Unitary EPS Dashboard State
  const [selectedEpsNit, setSelectedEpsNit] = useState(null);
  const [epsDetail, setEpsDetail] = useState(null);
  const [loadingEpsDetail, setLoadingEpsDetail] = useState(false);
  const [epsStatusFilter, setEpsStatusFilter] = useState('');

  // Coercitivo PDF/Print State
  const [coercitivoData, setCoercitivoData] = useState(null);
  const [showCoercitivoPrint, setShowCoercitivoPrint] = useState(false);

  // Comparativo State
  const [comparadoData, setComparadoData] = useState(DEFAULT_COMPARADO_DATA);
  const [loadingComparado, setLoadingComparado] = useState(false);
  const [comparadoFilter, setComparadoFilter] = useState('todos'); // 'todos', 'asistencial', 'mayores', 'aumentos'
  const [expandedConcepto, setExpandedConcepto] = useState(null);

  // Cashflow Forecast State
  const [forecastProbability, setForecastProbability] = useState('media'); // alta, media, baja

  // Alerts State
  const [alerts, setAlerts] = useState({
    incapacidades_excedidas: [],
    alto_valor_desatendidas: [],
    cuotas_partes_sin_gestion: []
  });
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  // Reminders State
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // SMTP / Email Configuration State
  const [smtpProvider, setSmtpProvider] = useState('smtp'); // 'smtp' or 'brevo'
  const [smtpServer, setSmtpServer] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState('cartera@assbasalud.gov.co');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpUseSsl, setSmtpUseSsl] = useState(true);
  const [brevoApiKey, setBrevoApiKey] = useState('');
  const [hasBrevoKey, setHasBrevoKey] = useState(false);
  const [smtpSaving, setSmtpSaving] = useState(false);
  const [smtpTestRecipient, setSmtpTestRecipient] = useState('');
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpTestMessage, setSmtpTestMessage] = useState('');

  // Notifications & Mass Mailing State (Ley 527/1999)
  const [notifData, setNotifData] = useState({ resumen: {}, entidades: [], smtp_info: {}, legal_text: '' });
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [selectedNits, setSelectedNits] = useState([]);
  const [notifSearch, setNotifSearch] = useState('');
  const [testEmailRecipient, setTestEmailRecipient] = useState('safarialzate@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [sendingBatch, setSendingBatch] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [previewModalEntity, setPreviewModalEntity] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [notifUploadFile, setNotifUploadFile] = useState(null);
  const [notifUploading, setNotifUploading] = useState(false);
  const [notifUploadMsg, setNotifUploadMsg] = useState('');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [quickCopiedNit, setQuickCopiedNit] = useState(null);
  const [modalCopyFeedback, setModalCopyFeedback] = useState('');

  const API_URL = window.location.origin === 'http://localhost:5173' 
    ? 'http://localhost:8000/api' 
    : `${window.location.origin}/api`;

  const [token, setToken] = useState(localStorage.getItem('sic_ese_token') || null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchComparado = async () => {
    try {
      setLoadingComparado(true);
      const res = await fetch(`${API_URL}/comparado`);
      if (res.ok) {
        const data = await res.json();
        setComparadoData(data);
      }
    } catch (err) {
      console.warn("Utilizando datos locales para informe comparativo:", err);
    } finally {
      setLoadingComparado(false);
    }
  };

  const authenticatedFetch = async (url, options = {}) => {
    const savedToken = localStorage.getItem('sic_ese_token');
    const headers = {
      ...options.headers,
    };
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }
    const response = await fetch(url, {
      ...options,
      headers
    });
    if (response.status === 401) {
      localStorage.removeItem('sic_ese_token');
      setToken(null);
      throw new Error('Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.');
    }
    return response;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (res.status === 200 && data.token) {
        localStorage.setItem('sic_ese_token', data.token);
        setToken(data.token);
      } else {
        setLoginError(data.detail || 'Credenciales incorrectas');
      }
    } catch (err) {
      setLoginError('Error de conexión con el servidor');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sic_ese_token');
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchConcentration();
      fetchAlerts();
      fetchReminders();
      fetchSmtpSettings();
      fetchComparado();
      fetchNotifData();
    }
  }, [token]);

  const fetchNotifData = async () => {
    try {
      setLoadingNotif(true);
      const res = await authenticatedFetch(`${API_URL}/notifications/data`);
      if (res.ok) {
        const data = await res.json();
        setNotifData(data);
        const validNits = (data.entidades || []).filter(e => e.correo && e.correo.includes('@')).map(e => e.nit);
        setSelectedNits(validNits);
      }
    } catch (err) {
      console.error("Error fetching notifications data:", err);
    } finally {
      setLoadingNotif(false);
    }
  };

  const handleSendTestNotification = async () => {
    if (!testEmailRecipient) return;
    try {
      setSendingTest(true);
      setTestResult(null);
      const res = await authenticatedFetch(`${API_URL}/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinatario: testEmailRecipient })
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.detail || 'Error al enviar prueba' });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendBatchNotifications = async () => {
    if (selectedNits.length === 0) {
      alert("Por favor selecciona al menos una entidad para enviar la notificación.");
      return;
    }
    const confirmMsg = `¿Está seguro de enviar los requerimientos de cobro formales a ${selectedNits.length} entidades seleccionadas bajo el marco de la Ley 527 de 1999?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setSendingBatch(true);
      setBatchResults(null);
      const res = await authenticatedFetch(`${API_URL}/notifications/send-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nits: selectedNits })
      });
      const data = await res.json();
      if (res.ok) {
        setBatchResults(data);
        alert(`Proceso completado. Notificaciones exitosas: ${data.exitosos}, Fallidas: ${data.fallidos}`);
      } else {
        alert(data.detail || "Error en el envío de requerimientos");
      }
    } catch (err) {
      alert("Error en el envío: " + err.message);
    } finally {
      setSendingBatch(false);
    }
  };

  const handlePreviewEntity = async (entity) => {
    setPreviewModalEntity(entity);
    setPreviewLoading(true);
    setPreviewContent(null);
    try {
      const res = await authenticatedFetch(`${API_URL}/notifications/preview/${entity.nit}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewContent(data);
      }
    } catch (err) {
      console.error("Error previewing notification:", err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const copyRichHtmlToClipboard = async (htmlString) => {
    try {
      const blobHtml = new Blob([htmlString], { type: 'text/html' });
      const blobText = new Blob([htmlString.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
      await navigator.clipboard.write(data);
      return true;
    } catch (err) {
      console.warn("Fallo ClipboardItem, usando fallback DOM:", err);
      try {
        const container = document.createElement('div');
        container.innerHTML = htmlString;
        container.style.position = 'fixed';
        container.style.pointerEvents = 'none';
        container.style.opacity = '0';
        document.body.appendChild(container);
        window.getSelection().removeAllRanges();
        const range = document.createRange();
        range.selectNode(container);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        document.body.removeChild(container);
        return true;
      } catch (e2) {
        console.error("No se pudo copiar al portapapeles:", e2);
        return false;
      }
    }
  };

  const copyTextToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    }
  };

  const downloadHtmlFile = (filename, htmlString) => {
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printHtmlDocument = (htmlString) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Por favor permita las ventanas emergentes (popups) para imprimir el requerimiento.");
      return;
    }
    printWindow.document.write(htmlString);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleExportAllZip = async () => {
    try {
      setDownloadingZip(true);
      const res = await authenticatedFetch(`${API_URL}/notifications/export-all-zip`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Requerimientos_Cobro_ASSBASALUD_Septiembre_2026.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("Error al generar el archivo ZIP de requerimientos.");
      }
    } catch (err) {
      console.error("Error descargando ZIP:", err);
      alert("Error descargando el archivo ZIP.");
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleQuickCopyEntity = async (entity) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/notifications/preview/${entity.nit}`);
      if (res.ok) {
        const data = await res.json();
        const success = await copyRichHtmlToClipboard(data.html);
        if (success) {
          setQuickCopiedNit(entity.nit);
          setTimeout(() => setQuickCopiedNit(null), 3000);
        } else {
          alert("No se pudo copiar automáticamente. Por favor use la opción de 'Vista Previa' para copiarlo.");
        }
      }
    } catch (err) {
      console.error("Error en copia rápida:", err);
    }
  };

  const handleQuickDownloadEntity = async (entity) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/notifications/preview/${entity.nit}`);
      if (res.ok) {
        const data = await res.json();
        const cleanName = (entity.cliente || 'Entidad').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 35);
        downloadHtmlFile(`Requerimiento_${cleanName}_${entity.nit}.html`, data.html);
      }
    } catch (err) {
      console.error("Error descargando requerimiento:", err);
    }
  };

  const handleUploadNotifExcel = async (e) => {
    e.preventDefault();
    if (!notifUploadFile) return;
    try {
      setNotifUploading(true);
      setNotifUploadMsg('');
      const formData = new FormData();
      formData.append('file', notifUploadFile);
      const res = await authenticatedFetch(`${API_URL}/notifications/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setNotifUploadMsg(`¡Éxito! ${data.message}. Se cargaron ${data.entidades.length} entidades.`);
        setNotifData(prev => ({
          ...prev,
          resumen: data.resumen,
          entidades: data.entidades
        }));
        setSelectedNits(data.entidades.filter(ent => ent.correo && ent.correo.includes('@')).map(ent => ent.nit));
      } else {
        setNotifUploadMsg(`Error: ${data.detail || 'Fallo en la carga'}`);
      }
    } catch (err) {
      setNotifUploadMsg(`Error al subir archivo: ${err.message}`);
    } finally {
      setNotifUploading(false);
    }
  };

  const filteredEntities = (notifData.entidades || []).filter(e => {
    if (!notifSearch) return true;
    const term = notifSearch.toLowerCase();
    return (
      (e.cliente && e.cliente.toLowerCase().includes(term)) ||
      (e.nit && String(e.nit).toLowerCase().includes(term)) ||
      (e.correo && e.correo.toLowerCase().includes(term))
    );
  });

  const handleToggleSelectAll = () => {
    const validCurrent = filteredEntities.filter(e => e.correo && e.correo.includes('@')).map(e => e.nit);
    if (selectedNits.length === validCurrent.length) {
      setSelectedNits([]);
    } else {
      setSelectedNits(validCurrent);
    }
  };

  const handleToggleSelectOne = (nit) => {
    if (selectedNits.includes(nit)) {
      setSelectedNits(selectedNits.filter(n => n !== nit));
    } else {
      setSelectedNits([...selectedNits, nit]);
    }
  };

  const handleSendSingleEntity = async (nit) => {
    const ent = notifData.entidades.find(e => e.nit === nit);
    if (!ent) return;
    if (!window.confirm(`¿Enviar requerimiento oficial a ${ent.cliente} (${ent.correo})?`)) return;
    try {
      setSendingBatch(true);
      const res = await authenticatedFetch(`${API_URL}/notifications/send-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nits: [nit] })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.exitosos > 0 ? "¡Requerimiento enviado con éxito!" : "Error al enviar: " + (data.detalles[0]?.detail || ''));
        setBatchResults(prev => {
          const oldList = prev?.detalles || [];
          const updated = [...oldList.filter(d => d.nit !== nit), ...(data.detalles || [])];
          return { ...prev, detalles: updated };
        });
      } else {
        alert(data.detail || "Error en el envío");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSendingBatch(false);
    }
  };

  const fetchSmtpSettings = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/settings/smtp`);
      const data = await res.json();
      if (data.configured) {
        setSmtpProvider(data.provider || 'smtp');
        setSmtpServer(data.smtp_server);
        setSmtpPort(data.smtp_port);
        setSmtpUser(data.smtp_user);
        setSmtpUseSsl(data.use_ssl);
        setHasBrevoKey(data.has_brevo_key);
      }
    } catch (err) {
      console.error("Error fetching SMTP settings:", err);
    }
  };

  const handleSaveSmtpSettings = async (e) => {
    e.preventDefault();
    try {
      setSmtpSaving(true);
      const res = await authenticatedFetch(`${API_URL}/settings/smtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: smtpProvider,
          smtp_server: smtpServer,
          smtp_port: parseInt(smtpPort),
          smtp_user: smtpUser,
          smtp_password: smtpPassword,
          use_ssl: smtpUseSsl,
          brevo_api_key: brevoApiKey
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("¡Configuración de correo guardada con éxito!");
        setSmtpPassword('');
        setBrevoApiKey('');
        fetchSmtpSettings();
      } else {
        alert(`Error al guardar: ${data.detail}`);
      }
    } catch (err) {
      console.error("Error saving SMTP settings:", err);
      alert("Error de red al guardar la configuración de correo");
    } finally {
      setSmtpSaving(false);
    }
  };


  const handleTestSmtpSettings = async (e) => {
    e.preventDefault();
    if (!smtpTestRecipient) {
      alert("Por favor ingrese un correo destinatario para la prueba.");
      return;
    }
    try {
      setSmtpTesting(true);
      setSmtpTestMessage("Enviando correo de prueba...");
      const res = await authenticatedFetch(`${API_URL}/settings/smtp/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinatario: smtpTestRecipient
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSmtpTestMessage(`¡Éxito! Correo de prueba enviado satisfactoriamente a ${smtpTestRecipient}.`);
      } else {
        setSmtpTestMessage(`Error de envío: ${data.detail}`);
      }
    } catch (err) {
      setSmtpTestMessage("Error de red al intentar la prueba SMTP.");
      console.error(err);
    } finally {
      setSmtpTesting(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, sheetFilter, categoryFilter, ageFilter]);


  // Handle Search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
      fetchInvoices();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await authenticatedFetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchConcentration = async () => {
    try {
      setLoadingConcentration(true);
      const res = await authenticatedFetch(`${API_URL}/stats/concentration`);
      const data = await res.json();
      setConcentration(data);
    } catch (err) {
      console.error("Error fetching concentration:", err);
    } finally {
      setLoadingConcentration(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoadingInvoices(true);
      let url = `${API_URL}/invoices?page=${currentPage}&page_size=50`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (sheetFilter) url += `&sheet=${encodeURIComponent(sheetFilter)}`;
      if (categoryFilter) url += `&categoria=${encodeURIComponent(categoryFilter)}`;
      if (ageFilter) url += `&age_range=${encodeURIComponent(ageFilter)}`;

      const res = await authenticatedFetch(url);
      const data = await res.json();
      setInvoices(data.data);
      setTotalRecords(data.total_records);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const res = await authenticatedFetch(`${API_URL}/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const fetchReminders = async () => {
    try {
      setLoadingReminders(true);
      const res = await authenticatedFetch(`${API_URL}/reminders`);
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    } finally {
      setLoadingReminders(false);
    }
  };

  const fetchEpsDetail = async (nit) => {
    try {
      setLoadingEpsDetail(true);
      setSelectedEpsNit(nit);
      setActivePage('eps-detail');
      
      const res = await authenticatedFetch(`${API_URL}/eps/${nit}`);
      const data = await res.json();
      setEpsDetail(data);
    } catch (err) {
      console.error("Error fetching EPS details:", err);
      alert("Error al cargar detalles de la EPS");
      setActivePage('dashboard');
    } finally {
      setLoadingEpsDetail(false);
    }
  };

  const loadCoercitivoData = async (nit) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/eps/${nit}/coercitivo-data`);
      const data = await res.json();
      setCoercitivoData(data);
      setShowCoercitivoPrint(true);
    } catch (err) {
      console.error("Error loading Coercitivo document:", err);
      alert("Error al cargar documento coercitivo");
    }
  };

  const handleSendReminder = async (id) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/reminders/${id}/send`, { method: 'POST' });
      if (res.ok) {
        alert("¡Recordatorio automático enviado exitosamente (Simulado)!");
        fetchReminders();
        fetchStats();
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setUploadMessage('Cargando y procesando archivo... Esto puede tardar unos segundos.');
      const res = await authenticatedFetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMessage('¡Éxito! El archivo Excel ha sido procesado y sincronizado de forma inteligente.');
        setSelectedFile(null);
        fetchStats();
        fetchConcentration();
        fetchAlerts();
        fetchInvoices();
      } else {
        setUploadMessage(`Error: ${data.detail}`);
      }
    } catch (err) {
      setUploadMessage('Error de red al subir el archivo.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const getBadgeClass = (category) => {
    if (!category) return 'badge-default';
    const cat = category.toUpperCase();
    if (cat.includes('CUOTAS PARTES')) return 'badge-mostaza';
    if (cat.includes('LIQUIDADAS')) return 'badge-rojo';
    if (cat.includes('CODA')) return 'badge-cafe';
    if (cat.includes('REVISIÓN') || cat.includes('REVISION')) return 'badge-morado';
    if (cat.includes('CONCILIADAS')) return 'badge-rosado';
    if (cat.includes('INCAPACIDADES')) return 'badge-verde-olivo';
    if (cat.includes('VACUNACIÓN') || cat.includes('VACUNACION')) return 'badge-azul-oscuro';
    if (cat.includes('RETENCIÓN') || cat.includes('RETENCION')) return 'badge-naranja';
    if (cat.includes('CÁPITA') || cat.includes('CAPITA')) return 'badge-vinotinto';
    if (cat.includes('DEVOLUCIONES')) return 'badge-gris';
    if (cat.includes('SIN APLICACIÓN') || cat.includes('SIN APLICACION')) return 'badge-azul-claro';
    if (cat.includes('CONCILIACIÓN') || cat.includes('CONCILIACION')) return 'badge-amarillo';
    if (cat.includes('PRESCRIPCIÓN') || cat.includes('PRESCRIPCION')) return 'badge-verde';
    return 'badge-default';
  };

  // Custom visual components for V2 charts
  const renderEpsBars = () => {
    if (!stats || !stats.by_eps) return null;
    const maxVal = Math.max(...stats.by_eps.map(e => e.saldo));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {stats.by_eps.slice(0, 5).map((e, i) => {
          const pct = maxVal > 0 ? (e.saldo / maxVal) * 100 : 0;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span 
                  style={{ fontWeight: '600', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => fetchEpsDetail(e.nit)}
                  title="Ver Dashboard Unitario de esta EPS"
                >
                  <Building size={12} /> {e.entidad}
                </span>
                <span style={{ fontWeight: '700' }}>{formatCurrency(e.saldo)}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--primary))', borderRadius: '4px' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCategoryBars = () => {
    if (!stats || !stats.by_category_2023) return null;
    const maxVal = Math.max(...stats.by_category_2023.map(c => c.saldo));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {stats.by_category_2023.slice(0, 6).map((c, i) => {
          const pct = maxVal > 0 ? (c.saldo / maxVal) * 100 : 0;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`badge ${getBadgeClass(c.categoria)}`} style={{ padding: '2px 4px', fontSize: '9px' }}>
                    {c.categoria}
                  </span>
                </span>
                <span style={{ fontWeight: '700' }}>{formatCurrency(c.saldo)}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Cashflow Forecast Calculator
  const getForecastValue = (days) => {
    if (!stats || !stats.total_saldo) return 0;
    
    // Probabilistic weights
    // Alta: recovers 90% corriente, 20% vencimiento temprano, 5% others
    // Media: recovers 80% corriente, 40% vencimiento temprano, 15% medium, 5% others
    // Baja: recovers 60% corriente, 30% vencimiento temprano, 10% medium
    const c = stats.by_aging?.age_0_30 || 0;
    const vt = stats.by_aging?.age_31_90 || 0;
    const vm = stats.by_aging?.age_91_180 || 0;
    const cr = stats.by_aging?.age_181_360 || 0;
    const pr = stats.by_aging?.age_360_plus || 0;
    
    // Add ADRES direct giro estimate (e.g. constant $800M cop per month)
    const adresGiro = 800000000; 

    if (days === 30) {
      if (forecastProbability === 'alta') return c * 0.90 + vt * 0.20 + adresGiro;
      if (forecastProbability === 'media') return c * 0.80 + vt * 0.40 + adresGiro;
      return c * 0.60 + vt * 0.30 + adresGiro;
    }
    if (days === 60) {
      if (forecastProbability === 'alta') return c * 0.95 + vt * 0.35 + vm * 0.10 + adresGiro * 2;
      if (forecastProbability === 'media') return c * 0.90 + vt * 0.60 + vm * 0.25 + adresGiro * 2;
      return c * 0.80 + vt * 0.45 + vm * 0.15 + adresGiro * 2;
    }
    // 90 days
    if (forecastProbability === 'alta') return c * 0.98 + vt * 0.50 + vm * 0.20 + cr * 0.05 + adresGiro * 3;
    if (forecastProbability === 'media') return c * 0.95 + vt * 0.80 + vm * 0.40 + cr * 0.15 + adresGiro * 3;
    return c * 0.90 + vt * 0.60 + vm * 0.25 + cr * 0.10 + adresGiro * 3;
  };

  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Consecutivo,NIT,Entidad,Saldo,Dias Mora,Categoria,Hoja\n";
    invoices.forEach(inv => {
      csvContent += `"${inv.consecutiv}","${inv.nit}","${inv.nombre}",${inv.saldo},${inv.nodias || 0},"${inv.categoria}","${inv.sheet_name}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_cartera_asbasalud.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-circle">C</div>
            <h2>SIC-ESE</h2>
            <p>Sistema Inteligente de Gestión de Cartera</p>
            <span className="hospital-tag">ASBASALUD E.S.E. Manizales</span>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Usuario</label>
              <input 
                type="text" 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                autoComplete="current-password"
              />
            </div>
            
            {loginError && <div className="login-error-msg">{loginError}</div>}
            
            <button type="submit" className="login-btn" disabled={loginLoading}>
              {loginLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          <div className="logo-text">
            <h1>SIC-ESE</h1>
            <span>ASBASALUD E.S.E</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li 
            className={`menu-item ${activePage === 'dashboard' || activePage === 'eps-detail' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Panel Principal</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'comparativo' ? 'active' : ''}`}
            onClick={() => setActivePage('comparativo')}
          >
            <BarChart3 size={18} />
            <span>Informe Comparativo</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'invoices' ? 'active' : ''}`}
            onClick={() => setActivePage('invoices')}
          >
            <FileSpreadsheet size={18} />
            <span>Explorador Cartera</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'alerts' ? 'active' : ''}`}
            onClick={() => setActivePage('alerts')}
          >
            <AlertOctagon size={18} />
            <span>Consola de Alertas</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'forecast' ? 'active' : ''}`}
            onClick={() => setActivePage('forecast')}
          >
            <TrendingUp size={18} />
            <span>Previsión Flujo Caja</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'mail' ? 'active' : ''}`}
            onClick={() => setActivePage('mail')}
          >
            <Mail size={18} />
            <span>Centro de Correo</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'notificaciones' ? 'active' : ''}`}
            onClick={() => setActivePage('notificaciones')}
          >
            <Send size={18} />
            <span>Cobro Masivo (Ley 527)</span>
          </li>
          <li 
            className={`menu-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => { setActivePage('settings'); setUploadMessage(''); }}
          >
            <Settings size={18} />
            <span>Ajustes e Importar</span>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile-row">
            <div className="user-avatar" style={{ backgroundColor: '#1d4ed8', color: '#ffffff', fontWeight: 'bold' }}>
              HR
            </div>
            <div className="user-info">
              <h4 style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>HECTOR FABIO RAMIREZ</h4>
              <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: 'var(--text-secondary)' }}>Profesional Universitario Cartera</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="main-content">
        <div className="top-header">
          <div className="page-title">
            <h2>
              {activePage === 'dashboard' && 'Resumen Ejecutivo Financiero'}
              {activePage === 'comparativo' && 'Informe Comparativo de Cartera: Julio 2025 vs. Julio 2026'}
              {activePage === 'invoices' && 'Explorador General de Facturas'}
              {activePage === 'alerts' && 'Semáforo Legal y Consola de Alertas'}
              {activePage === 'forecast' && 'Previsión de Flujo de Caja (Forecasting)'}
              {activePage === 'mail' && 'Centro de Correo (Compromisos Automáticos)'}
              {activePage === 'notificaciones' && 'Cobro Masivo y Notificaciones Legales (Ley 527/1999)'}
              {activePage === 'settings' && 'Ajustes y Carga de Archivos Excel'}
              {activePage === 'eps-detail' && 'Dashboard Unitario por EPS'}
            </h2>
            <p>
              {activePage === 'notificaciones' 
                ? 'Emisión y programación masiva de requerimientos de cobro persuasivo con estados de cuenta consolidados (Septiembre 2026)'
                : (activePage === 'comparativo' 
                    ? 'Análisis de Variaciones por Concepto, Crisis del Sector Salud y Dependencia del Régimen Subsidiado' 
                    : 'Cartera Corte Diciembre 2025 - Manizales E.S.E.')}
            </p>
          </div>
          
          <div className="header-actions">
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Sesión de Cartera: 
              <select 
                className="filter-select" 
                style={{ padding: '6px 10px', marginLeft: '8px' }}
                value={currentUser} 
                onChange={(e) => setCurrentUser(e.target.value)}
              >
                <option value="HECTOR FABIO RAMIREZ">HECTOR FABIO RAMIREZ (Prof. Univ. Cartera)</option>
                <option value="Jefe de Cartera">Jefe de Cartera (S. Partner)</option>
                <option value="Analista 1">Analista de Cartera 1</option>
                <option value="Analista 2">Analista de Cartera 2</option>
              </select>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Page body */}
        <div className="page-container">
          
          {/* PAGE 1: DASHBOARD */}
          {activePage === 'dashboard' && (
            <>
              {loadingStats || loadingConcentration ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><h3>Cargando indicadores financieros...</h3></div>
              ) : (
                <>
                  {/* KPI Cards */}
                  <div className="grid-4">
                    <div className="kpi-card" onClick={() => setActivePage('invoices')} style={{ cursor: 'pointer' }}>
                      <div className="kpi-details">
                        <span>Cartera Consolidada ESE</span>
                        <h3>{formatCurrency(stats.total_saldo)}</h3>
                        <div className="kpi-trend">
                          <Activity size={12} /> {stats.total_count} Facturas Activas
                        </div>
                      </div>
                      <div className="kpi-icon">
                        <DollarSign size={24} />
                      </div>
                    </div>

                    <div className="kpi-card gold" onClick={() => { setActivePage('invoices'); setAgeFilter('91-180'); }} style={{ cursor: 'pointer' }}>
                      <div className="kpi-details">
                        <span>Mora de Alto Riesgo (&gt;90d)</span>
                        <h3>
                          {formatCurrency(
                            (stats.by_aging?.age_91_180 || 0) + 
                            (stats.by_aging?.age_181_360 || 0) + 
                            (stats.by_aging?.age_360_plus || 0)
                          )}
                        </h3>
                        <div className="kpi-trend" style={{ color: 'var(--accent-gold)' }}>
                          <Clock size={12} /> Cobro Jurídico / Coercitivo
                        </div>
                      </div>
                      <div className="kpi-icon">
                        <Clock size={24} />
                      </div>
                    </div>

                    <div className="kpi-card blue">
                      <div className="kpi-details">
                        <span>Tasa de Cobro Efectivo</span>
                        <h3>{((stats.total_managed / stats.total_count) * 100).toFixed(1)}%</h3>
                        <div className="kpi-trend" style={{ color: 'var(--accent-blue)' }}>
                          <TrendingUp size={12} /> Facturas con Gestión CRM
                        </div>
                      </div>
                      <div className="kpi-icon">
                        <TrendingUp size={24} />
                      </div>
                    </div>

                    <div className="kpi-card red" onClick={() => setActivePage('alerts')} style={{ cursor: 'pointer' }}>
                      <div className="kpi-details">
                        <span>Alertas Críticas Semáforo</span>
                        <h3>{(alerts.incapacidades_excedidas?.length || 0) + (alerts.alto_valor_desatendidas?.length || 0)}</h3>
                        <div className="kpi-trend" style={{ color: 'var(--accent-red)' }}>
                          <AlertCircle size={12} /> Incapacidades y Vencidos
                        </div>
                      </div>
                      <div className="kpi-icon">
                        <AlertCircle size={24} />
                      </div>
                    </div>
                  </div>

                  {/* V2: Concentration & Impact Panels */}
                  <div className="panel glow-card">
                    <div className="panel-header">
                      <h3 className="panel-title"><Building size={18} /> Identificación de Concentración e Impacto Financiero</h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cálculo de Variables Críticas por EPS</span>
                    </div>
                    
                    <div className="grid-3" style={{ gap: '20px' }}>
                      {/* Mayor Deuda Nominal */}
                      <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-red)' }}>
                          <Building size={16} /> <strong>Mayor Deuda Nominal</strong>
                        </div>
                        <div className="list-container">
                          {concentration?.deuda?.map((d, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <span 
                                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
                                onClick={() => fetchEpsDetail(d.nit)}
                              >
                                {(d.entidad || 'Entidad').substring(0, 18)}
                              </span>
                              <strong>{formatCurrency(d.saldo)}</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mayor Volumen Facturación */}
                      <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-blue)' }}>
                          <FileText size={16} /> <strong>Mayor Volumen de Emisión</strong>
                        </div>
                        <div className="list-container">
                          {concentration?.volumen?.map((v, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <span 
                                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
                                onClick={() => fetchEpsDetail(v.nit)}
                              >
                                {(v.entidad || 'Entidad').substring(0, 18)}
                              </span>
                              <strong>{v.count} Facturas</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mayor Tasa de Glosa */}
                      <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                          <Percent size={16} /> <strong>Mayor Tasa de Objeción (%)</strong>
                        </div>
                        <div className="list-container">
                          {concentration?.glosa?.map((g, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <span 
                                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
                                onClick={() => fetchEpsDetail(g.nit)}
                              >
                                {(g.entidad || 'Entidad').substring(0, 18)}
                              </span>
                              <strong style={{ color: 'var(--accent-gold)' }}>{(g.tasa_glosa || 0).toFixed(1)}% Glosa</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid-2">
                    <div className="panel">
                      <div className="panel-header">
                        <h3 className="panel-title">Saldos Represados por EPS (Clic para Dashboard Unitario)</h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Deuda Nominal en Mora</span>
                      </div>
                      {renderEpsBars()}
                    </div>

                    <div className="panel">
                      <div className="panel-header">
                        <h3 className="panel-title">Distribución por Categoría (Otras EPS 2023)</h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tipologías Especiales</span>
                      </div>
                      {renderCategoryBars()}
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="panel">
                      <h3 className="panel-title">Segmentación Temporal (Supersalud NIIF)</h3>
                      <div className="aging-chart-container">
                        <div className="aging-bar-wrapper">
                          <div className="aging-bar-label">
                            <span>0 - 30 Días (Corriente)</span>
                            <strong>{formatCurrency(stats.by_aging?.age_0_30 || 0)}</strong>
                          </div>
                          <div className="aging-bar-bg">
                            <div className="aging-bar-fill" style={{ width: `${(stats.by_aging?.age_0_30 / stats.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                        <div className="aging-bar-wrapper">
                          <div className="aging-bar-label">
                            <span>31 - 90 Días (Temprano)</span>
                            <strong>{formatCurrency(stats.by_aging?.age_31_90 || 0)}</strong>
                          </div>
                          <div className="aging-bar-bg">
                            <div className="aging-bar-fill" style={{ width: `${(stats.by_aging?.age_31_90 / stats.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                        <div className="aging-bar-wrapper">
                          <div className="aging-bar-label">
                            <span>91 - 180 Días (Medio)</span>
                            <strong>{formatCurrency(stats.by_aging?.age_91_180 || 0)}</strong>
                          </div>
                          <div className="aging-bar-bg">
                            <div className="aging-bar-fill" style={{ width: `${(stats.by_aging?.age_91_180 / stats.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                        <div className="aging-bar-wrapper">
                          <div className="aging-bar-label">
                            <span>181 - 360 Días (Crítica)</span>
                            <strong>{formatCurrency(stats.by_aging?.age_181_360 || 0)}</strong>
                          </div>
                          <div className="aging-bar-bg">
                            <div className="aging-bar-fill" style={{ width: `${(stats.by_aging?.age_181_360 / stats.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                        <div className="aging-bar-wrapper">
                          <div className="aging-bar-label">
                            <span>Más de 360 Días (Coercitivo)</span>
                            <strong>{formatCurrency(stats.by_aging?.age_360_plus || 0)}</strong>
                          </div>
                          <div className="aging-bar-bg">
                            <div className="aging-bar-fill" style={{ width: `${(stats.by_aging?.age_360_plus / stats.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="panel" style={{ gridColumn: 'span 2' }}>
                      <h3 className="panel-title">Hojas de Cartera en Excel</h3>
                      <div className="list-container" style={{ marginTop: '10px' }}>
                        {stats.by_sheet?.map((sheet, i) => (
                          <div className="list-item" key={i}>
                            <div className="list-item-info">
                              <span className="list-item-title">{sheet.sheet_name}</span>
                              <span className="list-item-subtitle">{sheet.count} Registros de Facturación</span>
                            </div>
                            <span className="list-item-value">{formatCurrency(sheet.saldo)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* PAGE: INFORME COMPARATIVO DE CARTERA (2025 vs 2026)      */}
          {/* ========================================================= */}
          {activePage === 'comparativo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header Action Banner */}
              <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo, #6366f1)' }}>
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>
                      Análisis Comparativo por Conceptos: Julio 2025 vs. Julio 2026
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                      {comparadoData.entidad} &bull; <strong style={{ color: 'var(--accent-blue)' }}>{comparadoData.tipo_entidad}</strong>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      let csv = "Concepto,Julio 2025,Part 2025,Julio 2026,Part 2026,Variacion $,Variacion %\n";
                      comparadoData.conceptos.forEach(c => {
                        csv += `"${c.concepto}",${c.saldo_2025},${c.part_2025}%,${c.saldo_2026},${c.part_2026}%,${c.var_abs},${c.var_pct}%\n`;
                      });
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `comparado_cartera_julio_2026_2025.csv`;
                      a.click();
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                  >
                    <FileDown size={14} /> Exportar CSV
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={() => window.print()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                  >
                    <Printer size={14} /> Imprimir / PDF
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid-4">
                <div className="kpi-card">
                  <div className="kpi-details">
                    <span>Cartera Neta Total 2026</span>
                    <h3>{formatCurrency(comparadoData.totales.saldo_2026)}</h3>
                    <div className="kpi-trend" style={{ color: 'var(--accent-red, #ef4444)' }}>
                      <ArrowUpRight size={14} /> +{comparadoData.totales.variacion_porcentaje}% (+{formatCurrency(comparadoData.totales.variacion_absoluta)})
                    </div>
                  </div>
                  <div className="kpi-icon">
                    <DollarSign size={24} />
                  </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid var(--accent-indigo, #6366f1)' }}>
                  <div className="kpi-details">
                    <span>Régimen Subsidiado (Activo)</span>
                    <h3>{formatCurrency(comparadoData.conceptos.find(c => c.concepto === 'SUBSIDIADO')?.saldo_2026 || 0)}</h3>
                    <div className="kpi-trend" style={{ color: 'var(--accent-red, #ef4444)' }}>
                      <ArrowUpRight size={14} /> +58.15% (40.91% de participación)
                    </div>
                  </div>
                  <div className="kpi-icon" style={{ color: 'var(--accent-indigo, #6366f1)' }}>
                    <Building size={24} />
                  </div>
                </div>

                <div className="kpi-card gold">
                  <div className="kpi-details">
                    <span>Deudas de Difícil Cobro</span>
                    <h3>{formatCurrency(comparadoData.conceptos.find(c => c.concepto === 'DEUDAS DIFÍCIL COBRO')?.saldo_2026 || 0)}</h3>
                    <div className="kpi-trend" style={{ color: 'var(--accent-gold)' }}>
                      <Clock size={14} /> 50.30% total (EPS Liquidadas)
                    </div>
                  </div>
                  <div className="kpi-icon">
                    <Clock size={24} />
                  </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary, #10b981)' }}>
                  <div className="kpi-details">
                    <span>Abonos por Identificar (ADRES)</span>
                    <h3>{formatCurrency(Math.abs(comparadoData.conceptos.find(c => c.concepto.includes('ABONO SIN IDENTIFICAR'))?.saldo_2026 || 0))}</h3>
                    <div className="kpi-trend" style={{ color: 'var(--primary, #10b981)' }}>
                      <Check size={14} /> Giro Directo pendiente conciliar
                    </div>
                  </div>
                  <div className="kpi-icon" style={{ color: 'var(--primary)' }}>
                    <Percent size={24} />
                  </div>
                </div>
              </div>

              {/* Visual Comparative Charts */}
              <div className="grid-2" style={{ gap: '20px' }}>
                {/* Visual Bar Comparison Panel */}
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="panel-title" style={{ margin: 0 }}>
                      Comparativa de Crecimiento por Conceptos (2025 vs. 2026)
                    </h3>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-blue, #38bdf8)', borderRadius: '2px' }}></span> Julio 2025
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-indigo, #6366f1)', borderRadius: '2px' }}></span> Julio 2026
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { name: 'Subsidiado', v25: 2108636328, v26: 3334807358, pct: '+58.15%' },
                      { name: 'Difícil Cobro', v25: 3579100845, v26: 4100533585, pct: '+14.57%' },
                      { name: 'Salud Pública (PIC)', v25: 383936857, v26: 1115143231, pct: '+190.45%' },
                      { name: 'Contributivo', v25: 149055520, v26: 516677342, pct: '+246.63%' },
                      { name: 'IPS Privadas', v25: 49821158, v26: 146370036, pct: '+193.79%' },
                      { name: 'Otras Cuentas No Salud', v25: 30576472, v26: 38107937, pct: '+24.63%' }
                    ].map((item, idx) => {
                      const maxBase = 4200000000;
                      const w25 = (item.v25 / maxBase) * 100;
                      const w26 = (item.v26 / maxBase) * 100;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ fontWeight: '600' }}>{item.name}</span>
                            <span style={{ color: 'var(--accent-red)', fontWeight: '700' }}>{item.pct}</span>
                          </div>
                          {/* 2025 bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ height: '7px', flex: 1, backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${w25}%`, height: '100%', backgroundColor: 'var(--accent-blue, #38bdf8)', borderRadius: '4px' }}></div>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '70px', textAlign: 'right' }}>
                              {formatCurrency(item.v25)}
                            </span>
                          </div>
                          {/* 2026 bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ height: '9px', flex: 1, backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${w26}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: '4px' }}></div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', minWidth: '70px', textAlign: 'right' }}>
                              {formatCurrency(item.v26)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Participation & Composition Panel */}
                <div className="panel">
                  <h3 className="panel-title" style={{ marginBottom: '14px' }}>
                    Composición y Participación de Cartera 2026
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: 'Deudas de Difícil Cobro (EPS Liquidadas)', part: 50.30, val: 4100533585, color: '#f59e0b' },
                      { label: 'Régimen Subsidiado (Cartera Activa)', part: 40.91, val: 3334807358, color: '#6366f1' },
                      { label: 'Acciones de Salud Pública (Convenios PIC)', part: 13.68, val: 1115143231, color: '#38bdf8' },
                      { label: 'Régimen Contributivo', part: 6.34, val: 516677342, color: '#10b981' },
                      { label: 'IPS Privadas y Otros Deudores', part: 2.39, val: 195744837, color: '#ec4899' }
                    ].map((c, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }}></span>
                            {c.label}
                          </span>
                          <span style={{ fontWeight: '700' }}>{c.part}% ({formatCurrency(c.val)})</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.part}%`, height: '100%', backgroundColor: c.color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '12px', color: '#fca5a5' }}>
                      <strong>Alerta de Concentración:</strong> El Régimen Subsidiado y las Deudas de Difícil Cobro concentran el <strong>91,21% de todas las acreencias</strong> de la institución, reflejando el riesgo de liquidez del hospital público ante las EPS intervenidas.
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Financial Comparative Table */}
              <div className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <h3 className="panel-title" style={{ margin: 0 }}>
                      Detalle Contable Comparativo por Conceptos (Julio 2025 vs. Julio 2026)
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                      Haga clic en cualquier concepto para desplegar el diagnóstico y causa raíz de la variación.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Filtrar:</span>
                    <select 
                      className="filter-select" 
                      value={comparadoFilter} 
                      onChange={(e) => setComparadoFilter(e.target.value)}
                    >
                      <option value="todos">Todos los Conceptos (13)</option>
                      <option value="asistencial">Rentas Asistenciales</option>
                      <option value="mayores">Saldos Mayores a $100M</option>
                      <option value="aumentos">Solo con Aumento (+)</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Concepto de Deuda</th>
                        <th style={{ textAlign: 'right' }}>Julio 2025 (COP)</th>
                        <th style={{ textAlign: 'center' }}>Part. '25</th>
                        <th style={{ textAlign: 'right' }}>Julio 2026 (COP)</th>
                        <th style={{ textAlign: 'center' }}>Part. '26</th>
                        <th style={{ textAlign: 'right' }}>Variación ($)</th>
                        <th style={{ textAlign: 'center' }}>Variación (%)</th>
                        <th style={{ textAlign: 'center' }}>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparadoData.conceptos
                        .filter(item => {
                          if (comparadoFilter === 'asistencial') return item.tipo_renta === 'asistencial';
                          if (comparadoFilter === 'mayores') return Math.abs(item.saldo_2026) >= 100000000;
                          if (comparadoFilter === 'aumentos') return item.var_abs > 0;
                          return true;
                        })
                        .map((c, idx) => {
                          const isExpanded = expandedConcepto === c.concepto;
                          const isNegative = c.saldo_2026 < 0;
                          return (
                            <React.Fragment key={idx}>
                              <tr 
                                style={{ 
                                  cursor: 'pointer',
                                  backgroundColor: c.es_principal ? 'rgba(99, 102, 241, 0.08)' : isExpanded ? 'var(--bg-tertiary)' : 'transparent',
                                  fontWeight: c.es_principal ? '600' : 'normal'
                                }}
                                onClick={() => setExpandedConcepto(isExpanded ? null : c.concepto)}
                              >
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {c.es_principal && <span className="badge badge-alta" style={{ fontSize: '9px' }}>PRINCIPAL</span>}
                                    <span>{c.concepto}</span>
                                  </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  {isNegative ? `-${formatCurrency(Math.abs(c.saldo_2025))}` : formatCurrency(c.saldo_2025)}
                                </td>
                                <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                  {c.part_2025}%
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: '700' }}>
                                  {isNegative ? `-${formatCurrency(Math.abs(c.saldo_2026))}` : formatCurrency(c.saldo_2026)}
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: '700' }}>
                                  {c.part_2026}%
                                </td>
                                <td style={{ textAlign: 'right', color: c.var_abs > 0 ? 'var(--accent-red)' : 'var(--primary)' }}>
                                  {c.var_abs > 0 ? `+${formatCurrency(c.var_abs)}` : formatCurrency(c.var_abs)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <span 
                                    className={`badge ${c.var_pct > 0 ? 'badge-vencido' : 'badge-corriente'}`}
                                    style={{ fontSize: '10px', padding: '2px 6px' }}
                                  >
                                    {c.var_pct > 0 ? `+${c.var_pct}%` : `${c.var_pct}%`}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'center', color: 'var(--accent-blue)' }}>
                                  <Info size={14} />
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={8} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '14px 20px', fontSize: '12px', borderLeft: '4px solid var(--accent-indigo)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <strong style={{ color: 'var(--accent-blue)' }}>Diagnóstico Contable y Causa Raíz:</strong>
                                      <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-primary)' }}>{c.explicacion}</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid var(--accent-indigo)', fontWeight: '700', fontSize: '13px' }}>
                        <td>TOTAL CARTERA NETA</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(comparadoData.totales.saldo_2025)}</td>
                        <td style={{ textAlign: 'center' }}>100.0%</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(comparadoData.totales.saldo_2026)}</td>
                        <td style={{ textAlign: 'center' }}>100.0%</td>
                        <td style={{ textAlign: 'right', color: 'var(--accent-red)' }}>+{formatCurrency(comparadoData.totales.variacion_absoluta)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-vencido">+{comparadoData.totales.variacion_porcentaje}%</span>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Strategic Insights & Health Sector Analysis */}
              <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="var(--accent-indigo)" />
                  Diagnóstico Estratégico para la Junta Directiva y Ente Territorial
                </h3>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '8px' }}>
                      1. Dependencia Absoluta del Régimen Subsidiado
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      Como IPS pública de baja complejidad, Assbasalud tiene la misión constitucional de garantizar la puerta de entrada a los servicios de salud (urgencias básicas, consulta externa, medicina general y PYP) de los afiliados SISBEN. Al no poder rechazar usuarios, la ESE financia involuntariamente el déficit de las EPS subsidiadas (Nueva EPS y Asmet Salud), las cuales concentran más del 70% de la cartera corriente activa.
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-red)', marginBottom: '8px' }}>
                      2. Crisis Sistémica e Intervención de EPS
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      El incremento de +$1.226,1M (+58.15%) en la cartera subsidiada está estrechamente ligado a las medidas de intervención forzosa de la Superintendencia Nacional de Salud sobre Nueva EPS y Asmet Salud. La rotación de interventores ha congelado las mesas bilaterales de conciliación de glosas y la suscripción de acuerdos de pago por eventos y atenciones complementarias.
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                      3. Giro Directo ADRES: -$1.110,5M en Abonos sin Identificar
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      La cuenta transitoria negativa creció +89.44% porque la ADRES desembolsa giros directos por orden de la EPS, pero la aseguradora omite enviar la relación detallada de facturas pagadas. Por prudencia contable y para evitar glosas por descargos equivocados, la ESE no puede imputar el recaudo individual hasta no recibir la sábana de conciliación.
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '8px' }}>
                      4. Cartera de Difícil Cobro (50.30% del Total)
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                      Los $4.100,5M en cartera de difícil cobro corresponden a deudas de EPS liquidadas (Saludcoop, Cafesalud, Medimás, Coomeva). Se recomienda elevar solicitud formal a la Contaduría General de la Nación para aplicar saneamiento y provisión contable a aquellas entidades cuyo proceso de liquidación judicial ya concluyó sin masa de bienes remanentes.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* V2: EPS UNITARY DASHBOARD */}
          {activePage === 'eps-detail' && (
            <>
              {loadingEpsDetail || !epsDetail ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><h3>Cargando bitácora de la EPS...</h3></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Back button and title */}
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => setActivePage('dashboard')}
                    >
                      <ChevronLeftCircle size={16} /> Volver al Resumen
                    </button>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-primary"
                        onClick={() => loadCoercitivoData(epsDetail.info.nit)}
                        style={{ backgroundColor: 'var(--accent-red)' }}
                      >
                        <Printer size={16} /> Generar Oficio Cobro Coercitivo
                      </button>
                    </div>
                  </div>

                  {/* Header panel */}
                  <div className="panel glow-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyItems: 'center', gap: '20px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--primary)' }}>
                        <Building size={32} style={{ margin: 'auto' }} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{epsDetail.info.nombre}</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>NIT: {epsDetail.info.nit} | {epsDetail.info.count} Facturas Activas</p>
                      </div>
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Saldo Bruto Pendiente</span>
                        <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>{formatCurrency(epsDetail.info.total_saldo)}</h2>
                      </div>
                    </div>
                  </div>

                  {/* Semaphors and Status Distribution */}
                  <div className="grid-2">
                    {/* Ley 1438 Semaphor */}
                    <div className="panel" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                      <h3 className="panel-title"><Clock size={16} /> Alertas de Semáforo de Vencimiento (Ley 1438 de 2011)</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '-12px' }}>Cálculo basado en los plazos máximos legales de giros y glosas.</p>
                      
                      <div className="grid-3" style={{ gap: '14px', marginTop: '10px' }}>
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                          <span className="indicator-dot green" style={{ marginBottom: '6px' }}></span>
                          <h4 style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Radicación (0-20d)</h4>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>{formatCurrency(epsDetail.semaphor.verde_saldo || 0)}</h3>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{epsDetail.semaphor.verde_count} Facturas</span>
                        </div>
                        
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                          <span className="indicator-dot orange" style={{ marginBottom: '6px' }}></span>
                          <h4 style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Respuesta Glosas (21-45d)</h4>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>{formatCurrency(epsDetail.semaphor.amarillo_saldo || 0)}</h3>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{epsDetail.semaphor.amarillo_count} Facturas</span>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                          <span className="indicator-dot red" style={{ marginBottom: '6px' }}></span>
                          <h4 style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mora Persuasiva (&gt;45d)</h4>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px', color: 'var(--accent-red)' }}>{formatCurrency(epsDetail.semaphor.rojo_saldo || 0)}</h3>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{epsDetail.semaphor.rojo_count} Facturas</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="panel">
                      <h3 className="panel-title"><Activity size={16} /> Estados de Facturación y Flujo</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '-12px' }}>Distribución de saldos según radicación, auditoría y glosas.</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                        {/* Radicada */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                            <span>1. Radicada ({epsDetail.status_distribution.radicada_count} inv)</span>
                            <strong>{formatCurrency(epsDetail.status_distribution.radicada_saldo)}</strong>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                            <div style={{ height: '100%', borderRadius: '3px', backgroundColor: 'var(--primary)', width: `${(epsDetail.status_distribution.radicada_saldo / epsDetail.info.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                        {/* Auditada/Conciliada */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                            <span>2. Auditada / Conciliada ({epsDetail.status_distribution.auditada_count} inv)</span>
                            <strong>{formatCurrency(epsDetail.status_distribution.auditada_saldo)}</strong>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                            <div style={{ height: '100%', borderRadius: '3px', backgroundColor: 'var(--accent-blue)', width: `${(epsDetail.status_distribution.auditada_saldo / epsDetail.info.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                        {/* Glosada en Conciliación */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                            <span>3. Glosada en Conciliación ({epsDetail.status_distribution.glosada_count} inv)</span>
                            <strong>{formatCurrency(epsDetail.status_distribution.glosada_saldo)}</strong>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                            <div style={{ height: '100%', borderRadius: '3px', backgroundColor: 'var(--accent-gold)', width: `${(epsDetail.status_distribution.glosada_saldo / epsDetail.info.total_saldo) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRM Management Timeline */}
                  <div className="panel">
                    <h3 className="panel-title"><FileText size={16} /> Bitácora de Gestión (CRM de Cartera) de la EPS</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '-12px' }}>Historial cronológico de cobros e interacciones registradas para las facturas de esta EPS.</p>
                    
                    {epsDetail.history.length === 0 ? (
                      <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>No se registran notas de cobro aún para esta EPS.</p>
                    ) : (
                      <div className="timeline" style={{ marginTop: '10px' }}>
                        {epsDetail.history.map((hist, idx) => (
                          <div className="timeline-item" key={idx}>
                            <div className={`timeline-dot ${hist.tipo_gestion.toLowerCase()}`}></div>
                            <div className="timeline-content">
                              <div className="timeline-header">
                                <span>Factura <strong>{hist.consecutiv}</strong> ({hist.categoria})</span>
                                <span>{new Date(hist.fecha_gestion).toLocaleString('es-CO')}</span>
                              </div>
                              <div className="timeline-body">
                                <strong>Gestor ({hist.usuario}):</strong> {hist.descripcion}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* PAGE 2: EXPLORER */}
          {activePage === 'invoices' && (
            <div className="table-container">
              <div className="table-controls">
                <div className="search-box">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar por factura, EPS u observaciones..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <select 
                    className="filter-select"
                    value={sheetFilter}
                    onChange={(e) => { setSheetFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">-- Filtrar por Hoja Excel --</option>
                    <option value="CONSOLIDADO">Consolidado General</option>
                    <option value="ASMETSALUD_REPORTADAS">Asmetsalud Reportadas (Hoja 2)</option>
                    <option value="OTRAS_EPS_2013_2022">Otras EPS 2013-2022 (Hoja 3)</option>
                    <option value="OTRAS_EPS_2023">Otras EPS 2023 (Hoja Trabajo)</option>
                  </select>

                  <select 
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">-- Filtrar por Tipología --</option>
                    <option value="CUOTAS PARTES">CUOTAS PARTES (Mostaza)</option>
                    <option value="EPS LIQUIDADAS">EPS LIQUIDADAS (Rojo)</option>
                    <option value="INCAPACIDADES">INCAPACIDADES (Verde Olivo)</option>
                    <option value="VACUNACIÓN">VACUNACIÓN PAI (Azul Oscuro)</option>
                    <option value="SALDO POR RETENCIÓN">SALDO RETENCIÓN (Naranja)</option>
                    <option value="SALDO LIQUIDACIÓN CONTRACTUAL CÁPITA">SALDO LIQUIDACIÓN CÁPITA (Vinotinto)</option>
                    <option value="DEVOLUCIONES PARA PROCESO DE CONCILIACIÓN">DEVOLUCIONES CONCILIACIÓN (Gris)</option>
                    <option value="REPORTES DE PAGO, SIN APLICACIÓN EN CARTERA">REPORTES SIN APLICACIÓN (Azul Claro)</option>
                    <option value="FACTURAS PARA CONCILIACIÓN (GESTIÓN), GLOSAS. CARTERA">GLOSAS Y CONCILIACIÓN (Amarillo)</option>
                    <option value="FACTURAS PARA INICIAR PROCESO DE TRÁMITE O PRESCRIPCIÓN ANTE LA EPS">TRÁMITE / PRESCRIPCIÓN (Verde)</option>
                    <option value="FACTURAS PARA INICIO DE TRÁMITE ANTE LA EPS">TRÁMITE SIN COLOR (Ago-Dic 2023)</option>
                    <option value="FACTURAS CONCILIADAS">FACTURAS CONCILIADAS (Rosado)</option>
                  </select>

                  <select 
                    className="filter-select"
                    value={ageFilter}
                    onChange={(e) => { setAgeFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">-- Rango de Mora (Supersalud) --</option>
                    <option value="0-30">0 a 30 Días (Corriente)</option>
                    <option value="31-90">31 a 90 Días (Temprano)</option>
                    <option value="91-180">91 a 180 Días (Medio)</option>
                    <option value="181-360">181 a 360 Días (Crítica)</option>
                    <option value="360+">Más de 360 Días (Coercitivo)</option>
                  </select>
                  
                  <button className="btn-secondary" onClick={downloadReport} title="Descargar como CSV">
                    <FileDown size={16} /> Exportar
                  </button>
                </div>
              </div>

              {loadingInvoices ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><h3>Buscando facturas...</h3></div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Consecutivo</th>
                          <th>NIT</th>
                          <th>Entidad Deudora</th>
                          <th>Vencimiento</th>
                          <th>Días Mora</th>
                          <th>Valor</th>
                          <th>Saldo Pendiente</th>
                          <th>Categoría</th>
                          <th>Gestiones</th>
                          <th>Última Gestión</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.length === 0 ? (
                          <tr>
                            <td colSpan="11" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                              No se encontraron registros de cartera con los filtros seleccionados.
                            </td>
                          </tr>
                        ) : (
                          invoices.map((inv) => (
                            <tr key={inv.id}>
                              <td style={{ fontWeight: '600' }}>{inv.consecutiv}</td>
                              <td>{inv.nit}</td>
                              <td 
                                style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }} 
                                onClick={() => fetchEpsDetail(inv.nit)}
                                title="Ver Ficha de EPS"
                              >
                                {inv.nombre}
                              </td>
                              <td>{inv.fecha_vencimiento ? inv.fecha_vencimiento.split('T')[0] : 'N/A'}</td>
                              <td>
                                <span className={inv.nodias > 15 && inv.categoria === 'INCAPACIDADES' ? 'indicator-dot red' : ''} style={{ marginRight: '6px' }}></span>
                                {inv.nodias || 0}
                              </td>
                              <td>{formatCurrency(inv.valor)}</td>
                              <td style={{ fontWeight: '700', color: inv.saldo > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {formatCurrency(inv.saldo)}
                              </td>
                              <td>
                                <span className={`badge ${getBadgeClass(inv.categoria)}`}>
                                  {(inv.categoria || 'SIN CATEGORÍA').substring(0, 18)}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{inv.total_cobros || 0}</td>
                              <td>{inv.ultima_gestion ? new Date(inv.ultima_gestion).toLocaleDateString('es-CO') : 'Sin gestiones'}</td>
                              <td>
                                <button 
                                  className="btn-page" 
                                  style={{ padding: '4px 10px', fontSize: '11px' }}
                                  onClick={() => setSelectedInvoiceId(inv.id)}
                                >
                                  Ver Ficha / Cobrar
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="table-pagination">
                    <span>
                      Mostrando {invoices.length} de <strong>{totalRecords}</strong> deudas registradas
                    </span>
                    <div className="pagination-buttons">
                      <button 
                        className="btn-page" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        <ChevronLeft size={14} /> Anterior
                      </button>
                      <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', fontWeight: 'bold' }}>
                        Pág {currentPage} de {totalPages}
                      </span>
                      <button 
                        className="btn-page" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Siguiente <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PAGE 3: ALERTS */}
          {activePage === 'alerts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="alert-strip error">
                <AlertCircle size={20} />
                <div>
                  <strong>Consola Crítica Normativa ESE (Semáforo Legal):</strong> El sistema audita deudas de ASBASALUD aplicando la Ley 1438 (términos legales de cobro de incapacidades y giros de glosas).
                </div>
              </div>

              {loadingAlerts ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><h3>Procesando alertas de semáforo...</h3></div>
              ) : (
                <div className="grid-3" style={{ alignItems: 'start' }}>
                  
                  {/* Semáforo Incapacidades */}
                  <div className="panel glow-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <div className="panel-header">
                      <h3 className="panel-title" style={{ color: 'var(--accent-red)' }}>
                        <span className="indicator-dot red"></span> Incapacidades Vencidas (&gt;15 Días Hábiles)
                      </h3>
                      <span className="badge badge-rojo">{alerts.incapacidades_excedidas?.length || 0} críticas</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '-10px' }}>
                      Cuentas de cobro de incapacidades vencidas bajo límite legal de respuesta de la EPS.
                    </p>
                    
                    <div className="list-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                      {alerts.incapacidades_excedidas?.length === 0 ? (
                        <p style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay alertas activas de incapacidades.</p>
                      ) : (
                        alerts.incapacidades_excedidas.map((inv) => (
                          <div className="list-item" key={inv.id} style={{ display: 'block', padding: '12px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '12.5px' }}>Factura {inv.consecutiv}</strong>
                              <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>{inv.nodias} días mora</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              EPS: {inv.nombre} <br />
                              Saldo: <strong>{formatCurrency(inv.saldo)}</strong>
                            </div>
                            <button 
                              className="btn-primary" 
                              style={{ width: '100%', padding: '6px', fontSize: '11px' }}
                              onClick={() => setSelectedInvoiceId(inv.id)}
                            >
                              Redactar Cobro Incapacidad
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Cuotas Partes Pensionales */}
                  <div className="panel" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                    <div className="panel-header">
                      <h3 className="panel-title" style={{ color: 'var(--accent-gold)' }}>
                        <span className="indicator-dot orange"></span> Cuotas Partes sin Gestión (&gt;60 Días)
                      </h3>
                      <span className="badge badge-mostaza">{alerts.cuotas_partes_sin_gestion?.length || 0}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '-10px' }}>
                      Cobro de pasivos pensionales concurrentes con otras entidades públicas desatendidos.
                    </p>

                    <div className="list-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                      {alerts.cuotas_partes_sin_gestion?.length === 0 ? (
                        <p style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay alertas de cuotas partes.</p>
                      ) : (
                        alerts.cuotas_partes_sin_gestion.map((inv) => (
                          <div className="list-item" key={inv.id} style={{ display: 'block', padding: '12px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '12.5px' }}>Radicado {inv.consecutiv}</strong>
                              <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{formatCurrency(inv.saldo)}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              Entidad: {inv.nombre} <br />
                              Última Gestión: {inv.ultima_gestion ? new Date(inv.ultima_gestion).toLocaleDateString('es-CO') : 'Sin gestiones'}
                            </div>
                            <button 
                              className="btn-secondary" 
                              style={{ width: '100%', padding: '6px', fontSize: '11px', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
                              onClick={() => setSelectedInvoiceId(inv.id)}
                            >
                              Gestionar Cobro Persuasivo
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Alto Valor Desatendidas */}
                  <div className="panel">
                    <div className="panel-header">
                      <h3 className="panel-title">
                        <span className="indicator-dot orange"></span> Alto Valor Desatendido (&gt;$10M y &gt;90d)
                      </h3>
                      <span className="badge badge-default">{alerts.alto_valor_desatendidas?.length || 0}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '-10px' }}>
                      Facturas de cuantía relevante que no registran historial de contacto de cobro.
                    </p>

                    <div className="list-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                      {alerts.alto_valor_desatendidas?.length === 0 ? (
                        <p style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay facturas de alto valor desatendidas.</p>
                      ) : (
                        alerts.alto_valor_desatendidas.map((inv) => (
                          <div className="list-item" key={inv.id} style={{ display: 'block', padding: '12px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <strong style={{ fontSize: '12.5px' }}>Factura {inv.consecutiv}</strong>
                              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{formatCurrency(inv.saldo)}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              EPS: {inv.nombre} <br />
                              Días Mora: <strong>{inv.nodias} días</strong>
                            </div>
                            <button 
                              className="btn-primary" 
                              style={{ width: '100%', padding: '6px', fontSize: '11px', backgroundColor: 'var(--accent-blue)', color: 'white' }}
                              onClick={() => setSelectedInvoiceId(inv.id)}
                            >
                              Llamar o Registrar Nota
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* V2: PAGE 4: CASHFLOW FORECASTING */}
          {activePage === 'forecast' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="panel glow-card">
                <div className="panel-header">
                  <h3 className="panel-title"><TrendingUp size={18} /> Proyección Probabilística de Recaudo (30, 60 y 90 Días)</h3>
                  <div className="filter-group">
                    <button 
                      className={`btn-page ${forecastProbability === 'alta' ? 'active' : ''}`}
                      onClick={() => setForecastProbability('alta')}
                      style={forecastProbability === 'alta' ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
                    >
                      Probabilidad Alta
                    </button>
                    <button 
                      className={`btn-page ${forecastProbability === 'media' ? 'active' : ''}`}
                      onClick={() => setForecastProbability('media')}
                      style={forecastProbability === 'media' ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
                    >
                      Probabilidad Media
                    </button>
                    <button 
                      className={`btn-page ${forecastProbability === 'baja' ? 'active' : ''}`}
                      onClick={() => setForecastProbability('baja')}
                      style={forecastProbability === 'baja' ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
                    >
                      Probabilidad Conservadora
                    </button>
                  </div>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '-10px' }}>
                  Análisis predictivo de flujo de caja basado en el comportamiento de vencimientos Supersalud y un aporte mensual constante estimado del Giro Directo ADRES de <strong>$800M COP</strong>.
                </p>

                <div className="grid-3" style={{ marginTop: '15px' }}>
                  {/* Proyección 30 días */}
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Próximos 30 Días</div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--primary)' }}>{formatCurrency(getForecastValue(30))}</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Incluye {forecastProbability === 'alta' ? '90%' : forecastProbability === 'media' ? '80%' : '60%'} de Cartera Corriente + Giro ADRES.
                    </p>
                  </div>

                  {/* Proyección 60 días */}
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Próximos 60 Días</div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-blue)' }}>{formatCurrency(getForecastValue(60))}</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Acumula recuperación de Vencimiento Temprano + Giro ADRES x 2.
                    </p>
                  </div>

                  {/* Proyección 90 días */}
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Próximos 90 Días</div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-gold)' }}>{formatCurrency(getForecastValue(90))}</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Acumula cobro persuasivo de Vencimiento Medio + Giro ADRES x 3.
                    </p>
                  </div>
                </div>

                {/* SVG Visualizing line graph projection */}
                <div style={{ padding: '20px 0 10px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700' }}>Curva Probabilística de Recaudo Acumulado</div>
                  <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-end', padding: '20px 40px', gap: '20%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: '1' }}>
                      <div style={{ height: '30px', width: '24px', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0', minHeight: '10px' }}></div>
                      <span style={{ fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>Hoy</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: '1' }}>
                      <div style={{ height: '60px', width: '24px', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
                      <span style={{ fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>30 Días</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: '1' }}>
                      <div style={{ height: '90px', width: '24px', backgroundColor: 'var(--accent-blue)', borderRadius: '4px 4px 0 0' }}></div>
                      <span style={{ fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>60 Días</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: '1' }}>
                      <div style={{ height: '110px', width: '24px', backgroundColor: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                      <span style={{ fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>90 Días</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE: NOTIFICACIONES MASIVAS Y COBRO ELECTRÓNICO (LEY 527) */}
          {/* ========================================================= */}
          {activePage === 'notificaciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* TOP HEADER SUMMARY BAR */}
              <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
                      Emisión Masiva de Requerimientos de Cobro Persuasivo
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      Corte Septiembre 2026 • Estados de Cuenta con Plena Validez Probatoria • {notifData.resumen?.total_entidades || 52} Entidades Deudoras
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={fetchNotifData}
                    disabled={loadingNotif}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
                  >
                    <RefreshCw size={14} className={loadingNotif ? "spin" : ""} />
                    <span>Actualizar Datos</span>
                  </button>
                </div>
              </div>

              {/* ACTION BAR: UPLOAD EXCEL & TEST SENDING */}
              <div className="grid-2" style={{ gap: '18px' }}>
                {/* BOX 1: UPLOAD EXCEL FILE */}
                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={18} color="var(--primary)" />
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>Cargar Nuevo Archivo de Cartera con Correos</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Sube cualquier archivo Excel (.xlsx) con columnas de correo (Col B), NIT, Cliente y Facturas para actualizar el universo notificable.
                  </p>

                  <form onSubmit={handleUploadNotifExcel} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                    <input 
                      type="file" 
                      accept=".xlsx,.xls"
                      onChange={(e) => setNotifUploadFile(e.target.files[0])}
                      style={{ fontSize: '12px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                    <button 
                      type="submit" 
                      className="btn-secondary" 
                      disabled={!notifUploadFile || notifUploading}
                      style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Upload size={14} />
                      {notifUploading ? 'Procesando archivo...' : 'Cargar y Procesar Archivo'}
                    </button>
                  </form>
                  {notifUploadMsg && (
                    <div style={{ fontSize: '11.5px', padding: '8px 12px', borderRadius: '6px', background: notifUploadMsg.includes('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: notifUploadMsg.includes('Error') ? 'var(--accent-red)' : 'var(--primary)', border: `1px solid ${notifUploadMsg.includes('Error') ? 'var(--accent-red)' : 'var(--primary)'}` }}>
                      {notifUploadMsg}
                    </div>
                  )}
                </div>

                {/* BOX 2: TEST SENDING */}
                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={18} color="var(--accent-blue)" />
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>Prueba Inmediata de Correo Institucional</h4>
                    </div>
                    <span className="badge badge-corriente" style={{ fontSize: '10px' }}>
                      Canal: {notifData.smtp_info?.sender || 'Verificado'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Envía un requerimiento formal de prueba con el formato oficial, membrete y marco legal completo para certificar la recepción.
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={testEmailRecipient} 
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="correo@destino.com"
                      style={{ fontSize: '12px', flexGrow: 1 }}
                    />
                    <button 
                      className="btn-primary" 
                      onClick={handleSendTestNotification}
                      disabled={sendingTest || !testEmailRecipient}
                      style={{ padding: '8px 16px', fontSize: '12px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Send size={14} />
                      {sendingTest ? 'Enviando...' : 'Enviar Prueba'}
                    </button>
                  </div>
                  {testResult && (
                    <div style={{ fontSize: '11.5px', padding: '8px 12px', borderRadius: '6px', background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: testResult.success ? 'var(--primary)' : 'var(--accent-red)', border: `1px solid ${testResult.success ? 'var(--primary)' : 'var(--accent-red)'}` }}>
                      {testResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* JURIDICAL FRAMEWORK BANNER (LEY 527 DE 1999) */}
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', borderLeft: '5px solid var(--accent-blue)', borderRadius: '10px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontWeight: '700', fontSize: '0.95rem' }}>
                  <Building size={18} />
                  <span>MARCO JURÍDICO APLICABLE DE VALIDEZ PROBATORIA:</span>
                </div>
                <blockquote style={{ margin: '4px 0', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.6', background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '6px' }}>
                  "{notifData.legal_text || "SE REMITE ESTE E-MAIL EN VIRTUD DE LA LEY 527 DEL 18 DE AGOSTO DE 1999 Y LA LEY 962 DEL 8 DE JULIO DE 2005, LAS CUALES ESTABLECEN QUE LA INFORMACIÓN TRAMITADA POR ESTE MEDIO TIENE TOTAL VALIDEZ Y ES OBJETO DE PLENA PRUEBA. Y LA LEY 1437 DE 2011 ARTICULO 53 UTILIZACION DE MEDIOS ELECTRONICOS EN EL PROCEDIMIENTO ADMINISTRATIVO"}"
                </blockquote>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Cada notificación emitida incluye el detalle individual de facturas, vencimientos por rangos de edad (&gt;360 días), saldos pendientes e instrucciones de conciliación formal ante la ESE y la Superintendencia Nacional de Salud.
                </p>
              </div>

              {/* METRICS SUMMARY CARDS */}
              <div className="grid-4" style={{ gap: '14px' }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Entidades Deudoras</span>
                    <Building size={16} color="var(--primary)" />
                  </div>
                  <div className="card-value">{notifData.resumen?.total_entidades || 52}</div>
                  <span className="card-subtitle">Con correos registrados para cobro</span>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Facturas Consolidadas</span>
                    <FileText size={16} color="var(--accent-blue)" />
                  </div>
                  <div className="card-value">{notifData.resumen?.total_facturas?.toLocaleString() || '11,162'}</div>
                  <span className="card-subtitle">Relación detallada en estados de cuenta</span>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Saldo Total Notificable</span>
                    <DollarSign size={16} color="var(--accent-red)" />
                  </div>
                  <div className="card-value" style={{ color: 'var(--accent-red)', fontSize: '1.4rem' }}>
                    {formatCurrency(notifData.resumen?.total_saldo || 1916897468.23)}
                  </div>
                  <span className="card-subtitle">Corte Oficial: Septiembre 2026</span>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Selección Actual</span>
                    <CheckSquare size={16} color="var(--accent-gold)" />
                  </div>
                  <div className="card-value" style={{ color: 'var(--accent-gold)' }}>
                    {selectedNits.length}
                  </div>
                  <span className="card-subtitle">De {filteredEntities.length} entidades listadas</span>
                </div>
              </div>

              {/* TABLE CONTAINER: ENTITIES LIST */}
              <div className="table-container">
                <div className="table-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1, maxWidth: '420px' }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Buscar por NIT, Entidad o Correo..."
                      value={notifSearch}
                      onChange={(e) => setNotifSearch(e.target.value)}
                      style={{ fontSize: '12px', padding: '6px 12px', width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={handleExportAllZip}
                      disabled={downloadingZip || filteredEntities.length === 0}
                      title="Descargar paquete ZIP con todos los requerimientos oficiales en formato HTML con logos"
                      style={{ fontSize: '11.5px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--accent-indigo)' }}
                    >
                      <Archive size={14} color="var(--accent-indigo)" />
                      <span>{downloadingZip ? 'Generando ZIP...' : `Exportar Todos (ZIP - ${filteredEntities.length})`}</span>
                    </button>

                    <button 
                      className="btn-secondary" 
                      onClick={handleToggleSelectAll}
                      style={{ fontSize: '11.5px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {selectedNits.length === filteredEntities.filter(e => e.correo && e.correo.includes('@')).length ? (
                        <>
                          <Square size={14} />
                          <span>Deseleccionar Todos</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare size={14} />
                          <span>Seleccionar Todos ({filteredEntities.filter(e => e.correo && e.correo.includes('@')).length})</span>
                        </>
                      )}
                    </button>

                    <button 
                      className="btn-primary" 
                      onClick={handleSendBatchNotifications}
                      disabled={sendingBatch || selectedNits.length === 0}
                      style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Send size={15} />
                      <span>{sendingBatch ? 'Enviando Requerimientos...' : `Enviar a Seleccionadas (${selectedNits.length})`}</span>
                    </button>
                  </div>
                </div>

                <div className="table-wrapper" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px', textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedNits.length > 0 && selectedNits.length === filteredEntities.filter(e => e.correo && e.correo.includes('@')).length}
                            onChange={handleToggleSelectAll}
                          />
                        </th>
                        <th style={{ width: '45px', textAlign: 'center' }}>#</th>
                        <th>NIT</th>
                        <th>Entidad / Deudor</th>
                        <th>Correo Electrónico Notificable</th>
                        <th style={{ textAlign: 'center' }}>Facturas</th>
                        <th style={{ textAlign: 'right' }}>Saldo Total</th>
                        <th style={{ textAlign: 'right' }}>&gt; 360 Días</th>
                        <th style={{ textAlign: 'center' }}>Estado</th>
                        <th style={{ textAlign: 'center' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntities.length === 0 ? (
                        <tr>
                          <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                            No se encontraron entidades con el filtro aplicado.
                          </td>
                        </tr>
                      ) : (
                        filteredEntities.map((ent) => {
                          const isSelected = selectedNits.includes(ent.nit);
                          const hasEmail = ent.correo && ent.correo.includes('@');
                          const resultLog = batchResults?.detalles?.find(d => String(d.nit) === String(ent.nit));

                          return (
                            <tr key={ent.nit || ent.orden} style={{ backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.04)' : undefined }}>
                              <td style={{ textAlign: 'center' }}>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  disabled={!hasEmail}
                                  onChange={() => handleToggleSelectOne(ent.nit)}
                                />
                              </td>
                              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                                {ent.orden}
                              </td>
                              <td style={{ fontWeight: '600', fontSize: '12px' }}>
                                {ent.nit}
                              </td>
                              <td style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>
                                {ent.cliente}
                              </td>
                              <td>
                                {hasEmail ? (
                                  <span style={{ fontSize: '11.5px', color: 'var(--accent-blue)', display: 'inline-block', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ent.correo}>
                                    {ent.correo}
                                  </span>
                                ) : (
                                  <span className="badge badge-default" style={{ fontSize: '10px' }}>Sin Correo</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: '600', fontSize: '12px' }}>
                                {ent.total_facturas}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '12.5px', color: 'var(--accent-red)' }}>
                                {formatCurrency(ent.total_saldo)}
                              </td>
                              <td style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                                {formatCurrency(ent.venci_mas_360)}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {resultLog ? (
                                  resultLog.status === 'enviado' ? (
                                    <span className="badge badge-corriente" style={{ fontSize: '10.5px' }}>Enviado</span>
                                  ) : (
                                    <span className="badge badge-vencido" style={{ fontSize: '10.5px' }} title={resultLog.detail}>Error</span>
                                  )
                                ) : (
                                  <span className="badge badge-default" style={{ fontSize: '10.5px' }}>Pendiente</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <button 
                                    className="btn-secondary" 
                                    title="Ver Vista Previa y Opciones de Exportación / Copia"
                                    onClick={() => handlePreviewEntity(ent)}
                                    style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Eye size={13} />
                                    <span>Ver / Exportar</span>
                                  </button>

                                  <button 
                                    className="btn-secondary" 
                                    title="Copiar Requerimiento con Logos y Tablas para pegar en Correo (Ctrl+V)"
                                    onClick={() => handleQuickCopyEntity(ent)}
                                    style={{ 
                                      padding: '4px 8px', 
                                      fontSize: '11px', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '4px',
                                      backgroundColor: quickCopiedNit === ent.nit ? 'rgba(16, 185, 129, 0.2)' : undefined,
                                      borderColor: quickCopiedNit === ent.nit ? 'var(--primary)' : undefined,
                                      color: quickCopiedNit === ent.nit ? 'var(--primary)' : undefined
                                    }}
                                  >
                                    <Copy size={13} />
                                    <span>{quickCopiedNit === ent.nit ? '¡Copiado!' : 'Copiar'}</span>
                                  </button>

                                  <button 
                                    className="btn-secondary" 
                                    title="Descargar archivo HTML individual con logos"
                                    onClick={() => handleQuickDownloadEntity(ent)}
                                    style={{ padding: '4px 6px', fontSize: '11px', display: 'flex', alignItems: 'center' }}
                                  >
                                    <Download size={13} />
                                  </button>

                                  <button 
                                    className="btn-primary" 
                                    title="Enviar Notificación Oficial Individual por SMTP"
                                    disabled={!hasEmail || sendingBatch}
                                    onClick={() => handleSendSingleEntity(ent.nit)}
                                    style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Send size={13} />
                                    <span>Enviar</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* PAGE 5: MAIL CENTER */}
          {activePage === 'mail' && (
            <div className="table-container">
              <div className="table-controls">
                <h3 className="panel-title"><Mail size={16} /> Bandeja de Envíos de Compromisos y Recordatorios Automáticos</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Aquí confirma visualmente el envío de correos programados para recordar compromisos.
                </span>
              </div>

              {loadingReminders ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><h3>Cargando recordatorios...</h3></div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Factura</th>
                        <th>Entidad Deudora</th>
                        <th>Saldo</th>
                        <th>Destinatario</th>
                        <th>Asunto</th>
                        <th>Fecha Creación</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reminders.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            No hay correos programados ni enviados en el Mail Center.
                          </td>
                        </tr>
                      ) : (
                        reminders.map((rem) => (
                          <tr key={rem.id}>
                            <td style={{ fontWeight: '600' }}>{rem.consecutiv}</td>
                            <td>{rem.entidad}</td>
                            <td>{formatCurrency(rem.saldo)}</td>
                            <td>{rem.destinatario}</td>
                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {rem.asunto}
                            </td>
                            <td>{new Date(rem.fecha_programada).toLocaleDateString('es-CO')}</td>
                            <td>
                              <span className={`badge ${rem.estado === 'Enviado' ? 'badge-verde' : 'badge-amarillo'}`}>
                                {rem.estado}
                              </span>
                            </td>
                            <td>
                              {rem.estado === 'Pendiente' ? (
                                <button 
                                  className="btn-primary" 
                                  style={{ padding: '4px 10px', fontSize: '11px' }}
                                  onClick={() => handleSendReminder(rem.id)}
                                >
                                  Enviar (Confirmar)
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  Enviado el {new Date(rem.fecha_envio).toLocaleDateString('es-CO')}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PAGE 6: SETTINGS & UPLOAD */}
          {activePage === 'settings' && (
            <div className="grid-2">
              {/* Excel Import Panel */}
              <div className="panel glow-card">
                <div className="panel-header">
                  <h3 className="panel-title"><Upload size={18} /> Alimentar Sistema con Reporte Excel</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Suba un nuevo reporte contable de cartera consolidada (formato `.xlsx`). El sistema analizará las hojas, extraerá los colores y actualizará los saldos de deudas pendientes sin perder el historial de cobros realizados a las facturas actuales.
                </p>

                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                  <div style={{ 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '40px 20px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => document.getElementById('excel-file-input').click()}
                  >
                    <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Seleccione el archivo de corte de cartera</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Soporta archivos Excel (.xlsx) de hasta 50MB</p>
                    <input 
                      id="excel-file-input"
                      type="file" 
                      accept=".xlsx" 
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {selectedFile && (
                      <div style={{ marginTop: '16px', padding: '6px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '12px', display: 'inline-block', border: '1px solid var(--primary-glow)' }}>
                        Archivo seleccionado: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>

                  {uploadMessage && (
                    <div className={`alert-strip ${uploadMessage.includes('Error') ? 'error' : uploadMessage.includes('Cargando') ? 'warning' : 'success'}`}>
                      {uploadMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '12px' }}
                    disabled={!selectedFile || uploading}
                  >
                    {uploading ? 'Procesando archivo...' : 'Cargar y Sincronizar Cartera'}
                  </button>
                </form>
              </div>

              {/* SMTP Settings Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3 className="panel-title"><Mail size={18} /> Ajustes de Correo Saliente</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                  Configure las credenciales de correo de ASBASALUD para activar el envío real de cobros de incapacidades y persuasivos a las EPS. Si se deja vacío, el sistema opera en modo simulación.
                </p>

                <form onSubmit={handleSaveSmtpSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Canal de Envío</label>
                    <select 
                      className="filter-select"
                      value={smtpProvider}
                      onChange={(e) => setSmtpProvider(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="brevo">🚀 API Web de Brevo (Recomendado - Salta Bloqueos de Firewall)</option>
                      <option value="smtp">📧 SMTP Estándar (Gmail, Outlook, Servidor Propio)</option>
                    </select>
                  </div>

                  {smtpProvider === 'smtp' ? (
                    <>
                      <div className="form-group">
                        <label>Servidor SMTP de Correo</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={smtpServer}
                          onChange={(e) => setSmtpServer(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Puerto SMTP</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            value={smtpPort}
                            onChange={(e) => setSmtpPort(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Seguridad de Conexión</label>
                          <select 
                            className="filter-select"
                            value={smtpUseSsl ? 'ssl' : 'tls'}
                            onChange={(e) => {
                              const isSsl = e.target.value === 'ssl';
                              setSmtpUseSsl(isSsl);
                              setSmtpPort(isSsl ? 465 : 587);
                            }}
                            style={{ width: '100%' }}
                          >
                            <option value="ssl">SSL / TLS (Puerto 465)</option>
                            <option value="tls">STARTTLS (Puerto 587)</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Usuario / Correo Remitente</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Contraseña (o Contraseña de Aplicación)</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          value={smtpPassword}
                          onChange={(e) => setSmtpPassword(e.target.value)}
                          placeholder="••••••••••••"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Correo Remitente Autorizado en Brevo</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          placeholder="cartera@assbasalud.gov.co"
                          required 
                        />
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Debe coincidir exactamente con el remitente (sender) verificado en tu panel de Brevo.
                        </p>
                      </div>
                      <div className="form-group">
                        <label>API Key de Brevo (v3)</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          value={brevoApiKey}
                          onChange={(e) => setBrevoApiKey(e.target.value)}
                          placeholder={hasBrevoKey ? "•••••••••••••••••••••••• (API Key Guardada)" : "xkeysib-..."}
                          required={!hasBrevoKey}
                        />
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Obtenla gratis registrándote en Brevo &gt; SMTP & API &gt; API Keys.
                        </p>
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={smtpSaving}>
                    {smtpSaving ? 'Guardando...' : 'Guardar Configuración de Correo'}
                  </button>
                </form>

                {/* V2: Mail Connection Testing Section */}
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Probar Configuración de Correo</h4>
                  <form onSubmit={handleTestSmtpSettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group">
                      <label>Correo Destinatario de Prueba</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="ejemplo@correo.com"
                        value={smtpTestRecipient}
                        onChange={(e) => setSmtpTestRecipient(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn-secondary" style={{ width: '100%' }} disabled={smtpTesting}>
                      {smtpTesting ? 'Enviando Prueba...' : 'Enviar Correo de Prueba'}
                    </button>
                  </form>
                  {smtpTestMessage && (
                    <div className={`alert-strip ${smtpTestMessage.includes('Error') ? 'error' : smtpTestMessage.includes('Éxito') ? 'success' : 'warning'}`} style={{ marginTop: '12px', padding: '10px 14px', fontSize: '12px' }}>
                      {smtpTestMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Invoice Details Dialog Modal */}
      {selectedInvoiceId && (
        <InvoiceDetailsModal 
          invoiceId={selectedInvoiceId} 
          token={token}
          onClose={() => setSelectedInvoiceId(null)}
          onActionLogged={() => {
            fetchStats();
            fetchAlerts();
            fetchInvoices();
            fetchReminders();
            if (selectedEpsNit) fetchEpsDetail(selectedEpsNit);
          }}
        />
      )}

      {/* NOTIFICATION PREVIEW MODAL */}
      {previewModalEntity && (
        <div className="modal-overlay" onClick={() => setPreviewModalEntity(null)}>
          <div className="modal-content" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>
                  Vista Previa del Requerimiento Oficial de Cobro (Ley 527 de 1999)
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Destinatario: {previewModalEntity.cliente} ({previewModalEntity.correo || 'Sin correo'})
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setPreviewModalEntity(null)} style={{ padding: '4px 10px' }}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '16px 0' }}>
              {previewLoading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <p>Cargando vista previa institucional...</p>
                </div>
              ) : previewContent ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Action Toolbar for Manual Dispatch and Export */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-tertiary)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Opciones de Exportación y Despacho Individual:
                      </span>
                      {modalCopyFeedback && (
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
                          ✓ {modalCopyFeedback}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button 
                        className="btn-primary" 
                        onClick={async () => {
                          const ok = await copyRichHtmlToClipboard(previewContent.html);
                          if (ok) {
                            setModalCopyFeedback('¡Copiado con logos y tablas! Pégalo con Ctrl+V en tu correo.');
                            setTimeout(() => setModalCopyFeedback(''), 4000);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 14px', backgroundColor: '#10b981' }}
                      >
                        <Copy size={14} />
                        <span>Copiar para Correo (Ctrl+V en Gmail / Outlook)</span>
                      </button>

                      <button 
                        className="btn-secondary" 
                        onClick={() => {
                          const cleanName = (previewModalEntity.cliente || 'Entidad').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 35);
                          downloadHtmlFile(`Requerimiento_${cleanName}_${previewModalEntity.nit}.html`, previewContent.html);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 12px' }}
                      >
                        <Download size={14} />
                        <span>Descargar HTML</span>
                      </button>

                      <button 
                        className="btn-secondary" 
                        onClick={() => printHtmlDocument(previewContent.html)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 12px' }}
                      >
                        <Printer size={14} />
                        <span>Imprimir / Guardar en PDF</span>
                      </button>

                      <button 
                        className="btn-secondary" 
                        onClick={() => {
                          const mailto = `mailto:${encodeURIComponent(previewModalEntity.correo || '')}?subject=${encodeURIComponent(previewContent.subject)}`;
                          window.open(mailto, '_blank');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 12px' }}
                      >
                        <ExternalLink size={14} />
                        <span>Abrir en Cliente de Correo</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', marginTop: '4px', fontSize: '11.5px' }}>
                      <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Destinatario: <strong>{previewModalEntity.correo || 'Sin correo'}</strong></span>
                        {previewModalEntity.correo && (
                          <button 
                            className="btn-page" 
                            style={{ padding: '2px 8px', fontSize: '10.5px' }}
                            onClick={() => {
                              copyTextToClipboard(previewModalEntity.correo);
                              setModalCopyFeedback('Correo copiado.');
                              setTimeout(() => setModalCopyFeedback(''), 3000);
                            }}
                          >
                            Copiar
                          </button>
                        )}
                      </div>
                      <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                          Asunto: <strong>{previewContent.subject}</strong>
                        </span>
                        <button 
                          className="btn-page" 
                          style={{ padding: '2px 8px', fontSize: '10.5px' }}
                          onClick={() => {
                            copyTextToClipboard(previewContent.subject);
                            setModalCopyFeedback('Asunto copiado.');
                            setTimeout(() => setModalCopyFeedback(''), 3000);
                          }}
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rendered HTML Container */}
                  <div 
                    style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: '#ffffff', color: '#1e293b', padding: '10px' }}
                    dangerouslySetInnerHTML={{ __html: previewContent.html }}
                  />
                </div>
              ) : (
                <p style={{ color: 'var(--accent-red)' }}>No se pudo cargar la vista previa.</p>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn-secondary" onClick={() => setPreviewModalEntity(null)}>
                Cerrar
              </button>
              <button 
                className="btn-primary"
                disabled={!previewModalEntity.correo || sendingBatch}
                onClick={() => {
                  const nit = previewModalEntity.nit;
                  setPreviewModalEntity(null);
                  handleSendSingleEntity(nit);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={14} />
                <span>Enviar Esta Notificación Ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* V2: COERCITIVO printable layout */}
      {showCoercitivoPrint && coercitivoData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#fff',
          color: '#000',
          zIndex: 9999,
          overflowY: 'auto',
          padding: '40px 60px',
          fontFamily: 'serif',
          lineHeight: '1.5'
        }}
        className="printable-document"
        >
          {/* Printable page controls */}
          <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }} className="no-print">
            <button 
              className="btn-secondary" 
              onClick={() => setShowCoercitivoPrint(false)}
              style={{ color: '#000', borderColor: '#000', fontFamily: 'sans-serif' }}
            >
              Cerrar Vista Previa
            </button>
            <button 
              className="btn-primary" 
              onClick={() => window.print()}
              style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}
            >
              <Printer size={16} /> Imprimir / Guardar PDF
            </button>
          </div>

          {/* Letterhead */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{coercitivoData.entidad_remitente}</h2>
            <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>NIT: {coercitivoData.nit_remitente} | Manizales, Caldas</p>
            <div style={{ height: '2px', backgroundColor: '#000', marginTop: '15px' }}></div>
          </div>

          {/* Date and To */}
          <div style={{ marginBottom: '30px' }}>
            <p>{coercitivoData.ciudad}, {new Date(coercitivoData.fecha_documento).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <br />
            <p style={{ fontWeight: 'bold', margin: 0 }}>Señores:</p>
            <p style={{ fontWeight: 'bold', margin: 0 }}>{coercitivoData.entidad_deudora}</p>
            <p style={{ margin: 0 }}>Área de Cartera y Liquidación Contractual</p>
            <p style={{ margin: 0 }}>NIT: {coercitivoData.nit_deudora}</p>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '30px', textIndent: '0' }}>
            <p style={{ fontWeight: 'bold' }}>ASUNTO: {coercitivoData.referencia}</p>
          </div>

          {/* Body */}
          <div style={{ textAlign: 'justify', marginBottom: '25px' }}>
            <p>
              Cordial saludo,
            </p>
            <br />
            <p>
              De manera formal y con fundamento en los términos regulados por la <strong>Ley 1438 de 2011</strong> y la Circular Única de la Superintendencia Nacional de Salud, nos dirigimos a ustedes con el fin de formular requerimiento expreso de pago para las obligaciones asistenciales y conexas que su entidad adeuda a nuestra institución de salud. A la fecha de corte, registramos facturas vencidas con más de 45 días de mora por un valor consolidado de <strong>{formatCurrency(coercitivoData.total_saldo)}</strong>.
            </p>
            <br />
            <p>
              A continuación, se detalla la relación de consecutivos, fechas y saldos pendientes requeridos en este proceso persuasivo-coercitivo:
            </p>
          </div>

          {/* Invoices Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #000', textAlign: 'left' }}>
                <th style={{ padding: '6px' }}>Consecutivo</th>
                <th style={{ padding: '6px' }}>Emisión</th>
                <th style={{ padding: '6px' }}>Vencimiento</th>
                <th style={{ padding: '6px', textAlign: 'right' }}>Valor Factura</th>
                <th style={{ padding: '6px', textAlign: 'right' }}>Abonos</th>
                <th style={{ padding: '6px', textAlign: 'right' }}>Saldo Pendiente</th>
                <th style={{ padding: '6px', textAlign: 'center' }}>Mora (Días)</th>
              </tr>
            </thead>
            <tbody>
              {coercitivoData.invoices.slice(0, 100).map((inv, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '6px', fontWeight: 'bold' }}>{inv.consecutiv}</td>
                  <td style={{ padding: '6px' }}>{inv.fecha_emision ? inv.fecha_emision.split('T')[0] : 'N/A'}</td>
                  <td style={{ padding: '6px' }}>{inv.fecha_vencimiento ? inv.fecha_vencimiento.split('T')[0] : 'N/A'}</td>
                  <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(inv.valor)}</td>
                  <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(inv.abonos)}</td>
                  <td style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(inv.saldo)}</td>
                  <td style={{ padding: '6px', textAlign: 'center' }}>{inv.nodias}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold', fontSize: '13px' }}>
                <td colSpan="5" style={{ padding: '10px 6px' }}>TOTAL DEUDA REQUERIDA</td>
                <td style={{ padding: '10px 6px', textAlign: 'right', color: 'red' }}>{formatCurrency(coercitivoData.total_saldo)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* Warning text */}
          <div style={{ textAlign: 'justify', marginBottom: '50px' }}>
            <p>
              El no pago o no conciliación de este saldo dentro de los cinco (5) días hábiles siguientes al recibo de este oficio, nos obligará a reportar esta situación ante la Superintendencia Nacional de Salud y la Contraloría Territorial, además de iniciar los cobros coactivos pertinentes a los que haya lugar.
            </p>
            <br />
            <p>
              Agradecemos su atención inmediata a este requerimiento.
            </p>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
            <div style={{ width: '220px', borderTop: '1px solid #000', paddingTop: '8px', textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{coercitivoData.firmante}</p>
              <p style={{ fontSize: '12px', margin: 0 }}>{coercitivoData.cargo_firmante}</p>
              <p style={{ fontSize: '11px', margin: 0 }}>{coercitivoData.entidad_remitente}</p>
            </div>
            <div style={{ width: '220px', borderTop: '1px solid #000', paddingTop: '8px', textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>Revisó Jurídica</p>
              <p style={{ fontSize: '12px', margin: 0 }}>Asesor Legal Externo</p>
              <p style={{ fontSize: '11px', margin: 0 }}>Partner de Cartera ESE</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
