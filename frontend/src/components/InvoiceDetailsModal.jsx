import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone, Mail, FileText, CheckCircle, AlertTriangle, Send } from 'lucide-react';

export default function InvoiceDetailsModal({ invoiceId, onClose, onActionLogged }) {
  const [invoice, setInvoice] = useState(null);
  const [history, setHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Form states for new action
  const [tipoGestion, setTipoGestion] = useState('Llamada');
  const [descripcion, setDescripcion] = useState('');
  const [usuario, setUsuario] = useState('Jefe de Cartera');
  const [savingAction, setSavingAction] = useState(false);

  // Email template states
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('incapacidad');
  const [sendingEmail, setSendingEmail] = useState(false);

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/invoices/${invoiceId}`);
      const data = await res.json();
      setInvoice(data.invoice);
      setHistory(data.history);
      setReminders(data.reminders);
      
      // Auto prefill email if possible
      setEmailTo(getEmailForEPS(data.invoice.nombre));
      prefillEmailTemplate(selectedTemplate, data.invoice);
    } catch (err) {
      console.error("Error fetching invoice details:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmailForEPS = (epsName) => {
    const name = epsName.toUpperCase();
    if (name.includes('SANITAS')) return 'cartera.sanitas@sanitas.com.co';
    if (name.includes('SURA')) return 'cobros.cartera@sura.com.co';
    if (name.includes('NUEVA EPS')) return 'recobros@nuevaeps.com.co';
    if (name.includes('ASMET')) return 'cuentas.medicas@asmetsalud.com.co';
    if (name.includes('EMSSANAR')) return 'carterageneral@emssanar.org.co';
    if (name.includes('SALUD TOTAL')) return 'carterasalud@saludtotal.com.co';
    return 'contacto.cartera@eps.com.co';
  };

  const prefillEmailTemplate = (templateType, inv) => {
    if (!inv) return;
    
    let subject = '';
    let body = '';
    const formattedSaldo = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(inv.saldo);
    const dateStr = inv.fecha_vencimiento ? inv.fecha_vencimiento.split('T')[0] : 'N/A';
    
    if (templateType === 'incapacidad') {
      subject = `[URGENTE] Reclamación de Incapacidad - Consecutivo: ${inv.consecutiv} - ASBASALUD E.S.E.`;
      body = `Respetados Señores Cartera,
      
Por medio de la presente, solicitamos de manera formal el reconocimiento y pago de la cuenta de cobro por concepto de Incapacidad Médica del Personal con Consecutivo N° ${inv.consecutiv}, a nombre del funcionario identificado con NIT/CC del aportante: ${inv.nit}.

Detalles de la cuenta:
- Entidad: ${inv.nombre}
- Saldo Pendiente: ${formattedSaldo}
- Fecha de Vencimiento: ${dateStr}
- Días en Mora: ${inv.nodias} días

Recordamos que de acuerdo con el marco legal colombiano vigente para las Empresas Sociales del Estado (E.S.E.), las EPS cuentan con un término perentorio de 15 días hábiles para el pago o glosa de las cuentas de incapacidades debidamente radicadas. A la fecha, este término se encuentra vencido.

Agradecemos su pronta gestión de pago a nuestras cuentas maestras autorizadas.

Cordialmente,
Jefe de Cartera
ASBASALUD E.S.E. Manizales
contacto@asbasalud.gov.co`;
    } else if (templateType === 'persuasivo') {
      subject = `Cobro Persuasivo de Cartera - Factura: ${inv.consecutiv} - ASBASALUD E.S.E.`;
      body = `Señores
Área de Cartera y Glosas
${inv.nombre}

ASUNTO: Cobro persuasivo factura N° ${inv.consecutiv}

Cordial saludo,

De manera atenta nos dirigimos a ustedes con el fin de recordarles que en nuestros estados financieros a la fecha, registramos un saldo en mora por valor de ${formattedSaldo} correspondiente a la factura N° ${inv.consecutiv}, con fecha de vencimiento ${dateStr}.

A la fecha, el saldo presenta un retraso de ${inv.nodias} días. Les solicitamos comedidamente proceder con la conciliación o el pago respectivo en un plazo no mayor a cinco (5) días hábiles, o en su defecto hacernos llegar el soporte de transferencia en caso de haber sido cancelada.

Para aclaraciones o conciliaciones de glosas, pueden responder a este correo.

Atentamente,
Jefe de Cartera
ASBASALUD E.S.E. Manizales`;
    } else if (templateType === 'cuota_parte') {
      subject = `Cobro de Cuota Parte Pensional - Factura/Radicado: ${inv.consecutiv} - ASBASALUD E.S.E.`;
      body = `Señores
Área Financiera / Pasivos Pensionales
${inv.nombre}

Cordial saludo,

Por medio del presente correo, les recordamos el saldo pendiente por concepto de Cuota Parte Pensional acumulado de ex-funcionarios de nuestra entidad pública ASBASALUD E.S.E.

Información del cobro:
- Radicado / Consecutivo: ${inv.consecutiv}
- NIT Entidad Deudora: ${inv.nit}
- Valor en mora: ${formattedSaldo}
- Días desde notificación: ${inv.nodias} días

Este cobro se realiza bajo las normas que regulan los pasivos pensionales concurrentes entre entidades públicas colombianas. Solicitamos el inicio de trámite presupuestal de pago o hacernos saber la agenda de conciliación de saldos pensionales.

Atentamente,
Jefe de Cartera
ASBASALUD E.S.E. Manizales`;
    }

    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleTemplateChange = (e) => {
    const t = e.target.value;
    setSelectedTemplate(t);
    prefillEmailTemplate(t, invoice);
  };

  const handleLogAction = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    try {
      setSavingAction(true);
      const res = await fetch(`${API_URL}/invoices/${invoiceId}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_gestion: tipoGestion,
          descripcion: descripcion,
          usuario: usuario
        })
      });
      if (res.ok) {
        setDescripcion('');
        fetchInvoiceDetails();
        onActionLogged();
        setActiveTab('history');
      }
    } catch (err) {
      console.error("Error logging action:", err);
    } finally {
      setSavingAction(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      
      // 1. Create reminder record in DB first
      const resGen = await fetch(`${API_URL}/reminders/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: invoiceId,
          destinatario: emailTo,
          asunto: emailSubject,
          cuerpo: emailBody
        })
      });
      const dataGen = await resGen.json();
      
      if (resGen.ok) {
        // 2. Simulate sending the email (visual confirmation action)
        const resSend = await fetch(`${API_URL}/reminders/${dataGen.id}/send`, {
          method: 'POST'
        });
        
        if (resSend.ok) {
          alert(`¡Correo enviado y registrado con éxito a ${emailTo}!`);
          fetchInvoiceDetails();
          onActionLogged();
          setActiveTab('history');
        }
      }
    } catch (err) {
      console.error("Error sending email:", err);
    } finally {
      setSendingEmail(false);
    }
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  if (loading && !invoice) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Cargando detalles...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3>Factura N° {invoice.consecutiv}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {invoice.nombre} (NIT: {invoice.nit})
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-tabs">
            <span 
              className={`modal-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Ficha Técnica
            </span>
            <span 
              className={`modal-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Historial de Cobros ({history.length})
            </span>
            <span 
              className={`modal-tab ${activeTab === 'action' ? 'active' : ''}`}
              onClick={() => setActiveTab('action')}
            >
              Registrar Gestión
            </span>
            <span 
              className={`modal-tab ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              Enviar Correo de Cobro
            </span>
          </div>

          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p><strong>Hoja Origen:</strong> {invoice.sheet_name}</p>
                  <p><strong>Código Cuenta (Cta1):</strong> {invoice.cta1 || 'N/A'}</p>
                  <p><strong>Tipo Documento:</strong> {invoice.tipo || 'N/A'}</p>
                  <p><strong>Fecha Emisión:</strong> {invoice.fecha_emision ? invoice.fecha_emision.split('T')[0] : 'N/A'}</p>
                  <p><strong>Fecha Vencimiento:</strong> {invoice.fecha_vencimiento ? invoice.fecha_vencimiento.split('T')[0] : 'N/A'}</p>
                  <p><strong>Filing / Radicado:</strong> {invoice.radicado || 'N/A'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p><strong>Valor Factura:</strong> {formatCurrency(invoice.valor)}</p>
                  <p><strong>Abonos:</strong> {formatCurrency(invoice.abonos)}</p>
                  <p style={{ fontSize: '15px', color: 'var(--primary)' }}>
                    <strong>Saldo Pendiente:</strong> {formatCurrency(invoice.saldo)}
                  </p>
                  <p><strong>Días de Mora:</strong> <span className={invoice.nodias > 15 ? 'text-red' : ''}>{invoice.nodias || 0} días</span></p>
                  <p>
                    <strong>Clasificación:</strong>{' '}
                    <span className={`badge ${getBadgeClass(invoice.categoria)}`}>
                      {invoice.categoria}
                    </span>
                  </p>
                </div>
              </div>

              {invoice.observaciones && (
                <div className="alert-strip warning" style={{ display: 'block' }}>
                  <div style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} /> Observación Financiera Original (Excel):
                  </div>
                  <p style={{ fontSize: '12.5px', lineHeight: '1.4' }}>{invoice.observaciones}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {history.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                  No se registran gestiones de cobro para esta factura.
                </p>
              ) : (
                <div className="timeline">
                  {history.map((hist) => (
                    <div className="timeline-item" key={hist.id}>
                      <div className={`timeline-dot ${hist.tipo_gestion.toLowerCase()}`}></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span>{hist.tipo_gestion} por <strong>{hist.usuario}</strong></span>
                          <span>{new Date(hist.fecha_gestion).toLocaleString('es-CO')}</span>
                        </div>
                        <div className="timeline-body">{hist.descripcion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'action' && (
            <form onSubmit={handleLogAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Gestión</label>
                  <select 
                    className="filter-select"
                    value={tipoGestion} 
                    onChange={(e) => setTipoGestion(e.target.value)}
                  >
                    <option value="Llamada">Llamada Telefónica</option>
                    <option value="Correo">Correo Electrónico</option>
                    <option value="Oficio">Oficio / Carta Física</option>
                    <option value="Reunión">Conciliación / Reunión</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Responsable</label>
                  <select 
                    className="filter-select"
                    value={usuario} 
                    onChange={(e) => setUsuario(e.target.value)}
                  >
                    <option value="Jefe de Cartera">Jefe de Cartera (Jefe de Safari Partner)</option>
                    <option value="Analista 1">Analista de Cartera 1</option>
                    <option value="Analista 2">Analista de Cartera 2</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notas de la Gestión</label>
                <textarea 
                  className="form-textarea"
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escriba los detalles del compromiso adquirido, nombre de quien contestó, etc."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={savingAction}>
                  {savingAction ? 'Guardando...' : 'Registrar Cobro'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Seleccionar Plantilla Normativa</label>
                <select 
                  className="filter-select"
                  value={selectedTemplate} 
                  onChange={handleTemplateChange}
                >
                  <option value="incapacidad">Cobro de Incapacidades Laborales (Límite 15 días hábiles)</option>
                  <option value="persuasivo">Cobro Persuasivo General de Factura</option>
                  <option value="cuota_part">Cobro Cuotas Partes Pensionales (Pasivo Pensional)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Destinatario (EPS)</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Remitente</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value="contacto@asbasalud.gov.co" 
                    disabled 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Asunto</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cuerpo del Correo</label>
                <textarea 
                  className="form-textarea" 
                  style={{ minHeight: '220px', fontFamily: 'monospace', fontSize: '12px' }}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveTab('details')}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleSendEmail} 
                  disabled={sendingEmail}
                >
                  <Send size={16} /> {sendingEmail ? 'Enviando...' : 'Confirmar Enviar Correo (Simular)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
