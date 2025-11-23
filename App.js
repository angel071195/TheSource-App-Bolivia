import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  Modal, 
  Alert, 
  StatusBar, 
  SafeAreaView, 
  Dimensions,
  Switch,
  Share,
  Platform
} from 'react-native';
// Usamos iconos vectoriales nativos de Expo
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// --- CONSTANTES Y TEMA ---
const COLORS = {
  background: '#F9FAFB',
  white: '#FFFFFF',
  black: '#111827',
  grayText: '#6B7280',
  grayLight: '#E5E7EB',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  purpleLight: '#F3E8FF',
  facebook: '#1877F2',
  google: '#DB4437'
};

const { width } = Dimensions.get('window');

// --- DATOS ---
const CATEGORIES = [
  { id: 'AC_TECH', label: 'Técnico A/C', icon: 'snowflake' },
  { id: 'REFRIGERATION', label: 'Refrigeración', icon: 'thermometer' },
  { id: 'ELECTRICIAN', label: 'Electricista', icon: 'flash' },
  { id: 'PLUMBER', label: 'Plomería', icon: 'water' },
  { id: 'MASON', label: 'Albañilería', icon: 'wall' },
  { id: 'MECHANIC', label: 'Mecánico', icon: 'wrench' },
  { id: 'CLEANING', label: 'Limpieza', icon: 'sparkles' },
  { id: 'TRANSPORT', label: 'Transporte', icon: 'truck' },
];

const PRICING_UNITS = [
    { label: 'Precio fijo', value: 'fixed' },
    { label: 'Por hora', value: 'hour' },
    { label: 'Por día', value: 'day' },
    { label: 'Por metro cuadrado', value: 'm2' },
    { label: 'Por punto', value: 'point' },
    { label: 'Por visita', value: 'visit' },
    { label: 'A convenir', value: 'quote' }
];

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/png?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Bob',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Cal',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/png?seed=Molly',
];

const INITIAL_PROVIDERS = [
  {
    id: '1',
    name: 'Carlos Mamani',
    professions: ['Electricista'],
    rating: 4.8,
    reviews: 12,
    location: 'Puerto Quijarro, Centro',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    price: 50,
    unit: 'visit',
    walletBalance: 15,
    bio: 'Experto en instalaciones domiciliarias e industriales. 10 años de experiencia.',
    isVerified: true,
    issuesInvoice: true,
    cvUrl: 'https://example.com/cv.pdf',
    tariffs: [{service: 'Visita', price: 50, unit: 'visit'}, {service: 'Punto Eléctrico', price: 70, unit: 'point'}],
    paymentMethods: [{id: 'pm1', type: 'DIGITAL_WALLET', title: 'Yape', details: '70012345'}]
  },
  {
    id: '2',
    name: 'Ana Flores',
    professions: ['Limpieza'],
    rating: 5.0,
    reviews: 8,
    location: 'Barrio Lindo',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    price: 20,
    unit: 'hour',
    walletBalance: 2, 
    bio: 'Limpieza profunda y desinfección.',
    isVerified: false,
    issuesInvoice: false,
    tariffs: [{service: 'Limpieza General', price: 20, unit: 'hour'}],
    paymentMethods: [{id: 'pm2', type: 'CASH', title: 'Efectivo', details: 'Pago directo'}]
  }
];

// --- COMPONENTES PRINCIPALES DE LA APP ---

export default function App() {
  const [currentView, setCurrentView] = useState('LOGIN'); 
  const [userType, setUserType] = useState('CLIENT'); 
  
  // Estados Globales
  const [userData, setUserData] = useState({
      name: 'Usuario Nuevo', 
      email: '',
      location: 'Puerto Quijarro', 
      loyaltyPoints: 0,
      walletBalance: 0,
      unlockedLeads: [] // IDs de leads desbloqueados
  });

  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Datos del Muro y Leads
  const [leads, setLeads] = useState([
     { id: 'l1', clientName: 'Maria Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', message: 'Necesito reparar un enchufe.', status: 'LOCKED', date: 'Hoy', phone: '70012345', category: 'Electricista', budget: '50 Bs', location: 'Barrio Central' },
     { id: 'l2', clientName: 'Juan Perez', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', message: 'Cotización para cableado.', status: 'UNLOCKED', date: 'Ayer', phone: '70099999', category: 'Electricista', budget: 'A convenir', location: 'Zona Norte' }
  ]);

  const [jobPosts, setJobPosts] = useState([
      { id: 'jp1', title: 'Reparación de Refrigerador', description: 'Mi refrigerador LG no enfría abajo.', clientName: 'Pedro G.', location: 'Barrio Central', date: 'Hace 2h', category: 'Refrigeración', budget: 'A convenir' },
      { id: 'jp2', title: 'Instalación Aire Acondicionado', description: 'Necesito instalar un aire de 12000 BTU.', clientName: 'Sofia M.', location: 'Zona Norte', date: 'Hace 5h', category: 'Técnico A/C', budget: '200 Bs' },
  ]);

  // Datos Admin
  const [adminData, setAdminData] = useState({
      pendingRecharges: [{id: 'tx1', workerName: 'Carlos Mamani', amount: 50, date: 'Hoy', status: 'pending', proofUrl: ''}],
      jobAudits: [{id: 'jb1', service: 'Limpieza', amount: 100, warning: false, client: 'Maria'}, {id: 'jb2', service: 'Plomería', amount: 10, warning: true, client: 'Pedro'}],
      revenue: 1500
  });

  // Modal Bono
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);

  // --- LÓGICA DE NEGOCIO ---

  const calculateBonus = () => {
    const rand = Math.random();
    if (rand < 0.05) return 25; // 5% prob
    else if (rand < 0.15) return 20;
    else if (rand < 0.40) return 15;
    else return 10;
  };

  const handleJobSuccess = (earnedPoints) => {
      const newPoints = (userData.loyaltyPoints || 0) + earnedPoints;
      setUserData({...userData, loyaltyPoints: newPoints});
      Alert.alert("¡Excelente!", `Has ganado +${earnedPoints} puntos. Tu nuevo total es: ${newPoints}`);
      setCurrentView('HOME');
  };

  // Lógica CRÍTICA: Desbloqueo de Lead
  const handleUnlockLead = (leadId) => {
      const COST = 3;

      // 1. Verificar si ya está desbloqueado
      if (userData.unlockedLeads && userData.unlockedLeads.includes(leadId)) {
          const lead = leads.find(l => l.id === leadId);
          setSelectedLead(lead);
          setCurrentView('LEAD_DETAIL');
          return;
      }

      // 2. Verificar Saldo
      if (userData.walletBalance < COST) {
          Alert.alert("Saldo Insuficiente", "Necesitas al menos 3 Bs para desbloquear este contacto. Por favor recarga tu billetera.");
          return;
      }

      // 3. Ejecutar Transacción (Automática)
      // Descuento al usuario
      setUserData(prev => ({
          ...prev,
          walletBalance: prev.walletBalance - COST,
          unlockedLeads: [...(prev.unlockedLeads || []), leadId]
      }));

      // Aumento al Admin
      setAdminData(prev => ({
          ...prev,
          revenue: prev.revenue + COST
      }));

      // Actualizar estado local del lead
      setLeads(prev => prev.map(l => l.id === leadId ? {...l, status: 'UNLOCKED'} : l));

      // 4. Navegar Inmediatamente
      const lead = leads.find(l => l.id === leadId);
      if(lead) {
          setSelectedLead(lead);
          setCurrentView('LEAD_DETAIL');
      }
  };

  // Lógica Admin: Aprobar Recarga
  const handleApproveRecharge = (rechargeId) => {
      const recharge = adminData.pendingRecharges.find(r => r.id === rechargeId);
      if(!recharge) return;

      // Remover de pendientes
      setAdminData(prev => ({
          ...prev,
          pendingRecharges: prev.pendingRecharges.filter(r => r.id !== rechargeId)
      }));

      // Simular agregar saldo al usuario (si coincidiera el nombre)
      if (userData.name === recharge.workerName) {
          setUserData(prev => ({...prev, walletBalance: prev.walletBalance + recharge.amount}));
      }

      Alert.alert("Recarga Aprobada", `Se han acreditado Bs. ${recharge.amount} a ${recharge.workerName}.`);
  };

  const handleManualRecharge = (worker, amount) => {
      Alert.alert("Recarga Manual", `Se cargaron Bs. ${amount} a ${worker}.`);
  };

  // Navegación
  const navigateTo = (view) => {
    if(view === 'HIRE_MODE') {
        setCurrentView('HOME'); // Modo cliente
        return;
    }
    setSelectedProvider(null);
    setSelectedLead(null);
    setCurrentView(view);
  };

  // --- RENDERIZADO DE VISTAS ---

  const renderContent = () => {
    switch (currentView) {
      case 'LOGIN':
        return <LoginScreen onLogin={(type, data) => {
            setUserData({...userData, ...data});
            setUserType(type);
            navigateTo(type === 'CLIENT' ? 'HOME' : 'ONBOARDING_PROVIDER');
        }} />;
      
      case 'ONBOARDING_PROVIDER':
        return <ProviderOnboarding 
          onComplete={(data) => {
            const bonus = calculateBonus();
            setBonusAmount(bonus);
            setUserData({ ...userData, ...data, walletBalance: bonus, type: 'PROVIDER' });
            setShowBonusModal(true);
          }}
          onCloseBonus={() => {
            setShowBonusModal(false);
            setUserType('PROVIDER');
            navigateTo('MY_SERVICES');
          }}
          bonusAmount={bonusAmount}
          showBonusModal={showBonusModal}
          onCancel={() => navigateTo('LOGIN')}
        />;

      case 'HOME':
        return <HomeView 
           userData={userData} 
           providers={providers} 
           onSelectProvider={(p) => { setSelectedProvider(p); setCurrentView('PROFILE_DETAIL'); }}
           onToggleSearch={() => setCurrentView('SEARCH')}
        />;
      
      case 'SEARCH':
          return <SearchView 
             providers={providers}
             onSelectProvider={(p) => { setSelectedProvider(p); setCurrentView('PROFILE_DETAIL'); }}
          />;

      case 'REQUEST_SERVICE':
        return <ClientJobPost 
          onClose={() => navigateTo('HOME')} 
          onSubmit={() => {
             Alert.alert("¡Publicado!", "Tu solicitud ha sido enviada al Muro.");
             navigateTo('HOME');
          }}
        />;

      case 'CLIENT_PROFILE':
        return <ClientProfileView 
           profile={userData} 
           onNavigate={navigateTo}
        />;

      case 'PROFILE_DETAIL':
        return selectedProvider ? <ProfileDetail 
          provider={selectedProvider} 
          onBack={() => navigateTo('HOME')}
          onSendRequest={() => {
             Alert.alert("Solicitud Enviada", "El profesional ha recibido tu solicitud.");
             navigateTo('HOME');
          }}
        /> : null;

      case 'WORKER_DASHBOARD': 
        return <WorkerDashboard 
           userData={userData}
           leads={leads}
           onUnlock={handleUnlockLead}
           onViewLead={(l) => { setSelectedLead(l); setCurrentView('LEAD_DETAIL'); }}
        />;
      
      case 'LEAD_DETAIL':
          return selectedLead ? <LeadDetailView lead={selectedLead} onBack={() => navigateTo('WORKER_DASHBOARD')} /> : null;

      case 'MY_SERVICES': 
        return <MyServicesPanel 
            userData={userData}
            onNavigate={navigateTo}
        />;

      case 'WALLET':
        return <WalletView 
           userData={userData} 
           onRecharge={() => {
              Alert.alert("Solicitud Enviada", "El admin revisará tu comprobante.");
              navigateTo('WALLET');
           }}
        />;
      
      case 'OPPORTUNITIES': 
          return <OpportunitiesView jobPosts={jobPosts} />;
      
      case 'ADMIN': 
          return <AdminDashboard 
              adminData={adminData} 
              onBack={() => navigateTo('CLIENT_PROFILE')} 
              onApproveRecharge={handleApproveRecharge}
              onManualRecharge={handleManualRecharge}
          />;
      
      case 'JOB_CLOSING':
          return <JobClosingSimulation 
              onClose={() => navigateTo('MY_SERVICES')}
              onSuccess={handleJobSuccess}
          />;

      case 'TERMS': return <TermsView onBack={() => navigateTo('CLIENT_PROFILE')} />;
      case 'HELP': return <HelpCenter onBack={() => navigateTo('CLIENT_PROFILE')} />;

      default: return <HomeView userData={userData} providers={providers} onSelectProvider={() => {}} />;
    }
  };

  // Barra de Navegación Condicional
  const showNav = !['LOGIN', 'ONBOARDING_PROVIDER', 'JOB_CLOSING', 'ADMIN', 'PROFILE_DETAIL', 'LEAD_DETAIL', 'TERMS'].includes(currentView);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {showNav && (
        <BottomNavigation 
          currentTab={currentView} 
          userType={userType}
          onTabPress={(tab) => navigateTo(tab)}
        />
      )}
    </SafeAreaView>
  );
}

// =====================================================================
// VISTAS & COMPONENTES (TRADUCCIÓN RN)
// =====================================================================

// 1. LOGIN
const LoginScreen = ({ onLogin }) => {
    const [step, setStep] = useState('LANDING');
    const [tempData, setTempData] = useState({ name: '', email: '', location: '', phone: '', image: '' });

    if (step === 'LANDING') {
        return (
            <View style={styles.loginContainer}>
                <View style={{alignItems:'center', marginBottom:40}}>
                    <View style={styles.logoBox}><Text style={styles.logoLetter}>S</Text></View>
                    <Text style={styles.appTitle}>THE SOURCE</Text>
                    <Text style={styles.appSubtitle}>Solutions App</Text>
                </View>
                <View style={{width:'100%'}}>
                    <Text style={styles.label}>Número de Celular</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="70012345" 
                        keyboardType="phone-pad" 
                        value={tempData.phone}
                        onChangeText={t => setTempData({...tempData, phone: t})}
                    />
                    
                    <TouchableOpacity style={[styles.socialButton, {backgroundColor: COLORS.google, borderColor: COLORS.google}]}>
                        <MaterialCommunityIcons name="google" size={20} color="white" />
                        <Text style={[styles.socialText, {color:'white'}]}>Continuar con Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.socialButton, {backgroundColor: COLORS.facebook, borderColor: COLORS.facebook}]}>
                        <MaterialCommunityIcons name="facebook" size={20} color="white" />
                        <Text style={[styles.socialText, {color: 'white'}]}>Continuar con Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('DETAILS')}>
                        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginTop: 20}} onPress={() => setStep('DETAILS')}>
                        <Text style={{textAlign:'center', color:COLORS.blue, fontWeight:'bold'}}>¿No tienes cuenta? Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // Paso Detalles y Foto simplificado en uno para brevedad en RN
    if (step === 'DETAILS') {
        return (
            <ScrollView contentContainerStyle={styles.loginContainer}>
                <Text style={styles.headerTitle}>¡Bienvenido!</Text>
                <Text style={styles.subText}>Verificaremos tu perfil en unos segundos.</Text>
                
                <Text style={styles.label}>Nombre Completo</Text>
                <TextInput style={styles.input} value={tempData.name} onChangeText={t => setTempData({...tempData, name:t})} />
                
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} keyboardType="email-address" value={tempData.email} onChangeText={t => setTempData({...tempData, email:t})} />
                
                <Text style={styles.label}>Ubicación</Text>
                <TextInput style={styles.input} value={tempData.location} onChangeText={t => setTempData({...tempData, location:t})} />

                <Text style={[styles.label, {marginTop:20}]}>Elige un Avatar (Opcional)</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:20}}>
                    {AVATARS.map((uri, i) => (
                        <TouchableOpacity key={i} onPress={() => setTempData({...tempData, image: uri})}>
                            <Image source={{uri}} style={[styles.avatarOption, tempData.image === uri && {borderColor: COLORS.blue, borderWidth: 2}]} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={() => onLogin('CLIENT', tempData)}>
                    <Text style={styles.primaryButtonText}>Finalizar</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
    return null;
};

// 2. PROVIDER ONBOARDING (Simplified)
const ProviderOnboarding = ({ onComplete, onCancel, showBonusModal, bonusAmount, onCloseBonus }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', age: '', phone: '', location: '', bio: '',
        professions: [], tariffs: [], paymentMethods: [], issuesInvoice: false, acceptedTerms: false
    });
    const [newTariff, setNewTariff] = useState({service: '', price: '', unit: 'fixed'});
    const [showTerms, setShowTerms] = useState(false);

    const toggleProfession = (label) => {
        const current = formData.professions;
        if(current.includes(label)) setFormData({...formData, professions: current.filter(x=>x!==label)});
        else setFormData({...formData, professions: [...current, label]});
    };

    return (
        <View style={styles.container}>
            <View style={styles.progressHeader}>
                <TouchableOpacity onPress={step===1 ? onCancel : () => setStep(step-1)}><Ionicons name="arrow-back" size={24}/></TouchableOpacity>
                <View style={{flexDirection:'row', gap:4}}>{[1,2,3,4].map(i=><View key={i} style={[styles.progressDot, i<=step && {backgroundColor: COLORS.black, width:24}]}/>)}</View>
                <View style={{width:24}}/>
            </View>

            <ScrollView contentContainerStyle={{padding:20}}>
                {step === 1 && (
                    <View>
                        <Text style={styles.headerTitle}>Datos Personales</Text>
                        <Input label="Nombre Completo" value={formData.name} onChangeText={t=>setFormData({...formData, name:t})}/>
                        <View style={{flexDirection:'row', gap:10}}>
                            <View style={{flex:1}}><Input label="Edad" keyboardType="numeric" value={formData.age} onChangeText={t=>setFormData({...formData, age:t})}/></View>
                            <View style={{flex:1}}><Input label="Celular" keyboardType="phone-pad" value={formData.phone} onChangeText={t=>setFormData({...formData, phone:t})}/></View>
                        </View>
                        <Input label="Ubicación" value={formData.location} onChangeText={t=>setFormData({...formData, location:t})}/>
                        <Text style={styles.label}>Sobre Ti</Text>
                        <TextInput style={[styles.input, {height:80, textAlignVertical:'top'}]} multiline value={formData.bio} onChangeText={t=>setFormData({...formData, bio:t})}/>
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text style={styles.headerTitle}>Profesión y Tarifas</Text>
                        <View style={styles.chipContainer}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity key={cat.id} style={[styles.chip, formData.professions.includes(cat.label) && styles.chipActive]} onPress={() => toggleProfession(cat.label)}>
                                    <MaterialCommunityIcons name={cat.icon} size={18} color={formData.professions.includes(cat.label) ? COLORS.white : COLORS.grayText}/>
                                    <Text style={[styles.chipText, formData.professions.includes(cat.label) && {color: COLORS.white}]}>{cat.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        <View style={styles.invoiceRow}>
                            <Text style={{fontWeight:'bold'}}>¿Emite Factura?</Text>
                            <Switch value={formData.issuesInvoice} onValueChange={v => setFormData({...formData, issuesInvoice: v})} trackColor={{true: COLORS.blue}} />
                        </View>

                        <Text style={styles.label}>Tus Tarifas</Text>
                        {formData.tariffs.map((t,i) => (
                            <View key={i} style={styles.tariffRow}>
                                <Text>{t.service}</Text>
                                <Text style={{fontWeight:'bold', color: COLORS.blue}}>Bs. {t.price}</Text>
                            </View>
                        ))}
                        <View style={styles.addTariffBox}>
                            <TextInput style={[styles.input, {marginBottom:5}]} placeholder="Servicio (ej. Visita)" value={newTariff.service} onChangeText={t=>setNewTariff({...newTariff, service:t})}/>
                            <View style={{flexDirection:'row', gap:5}}>
                                <TextInput style={[styles.input, {flex:1}]} placeholder="Precio" keyboardType="numeric" value={newTariff.price} onChangeText={t=>setNewTariff({...newTariff, price:t})}/>
                            </View>
                            <Button title="+ Agregar" onPress={() => {
                                if(newTariff.service && newTariff.price) {
                                    setFormData({...formData, tariffs: [...formData.tariffs, newTariff]});
                                    setNewTariff({service:'', price:'', unit:'fixed'});
                                }
                            }} />
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text style={styles.headerTitle}>Verificación</Text>
                        <Text style={styles.subText}>Sube fotos de tu carnet.</Text>
                        <View style={{flexDirection:'row', gap:10}}>
                            <TouchableOpacity style={styles.uploadBox}><Ionicons name="camera" size={24}/><Text style={styles.smallText}>Anverso</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.uploadBox}><Ionicons name="camera" size={24}/><Text style={styles.smallText}>Reverso</Text></TouchableOpacity>
                        </View>
                        <Text style={[styles.label, {marginTop:20}]}>Currículum (Opcional)</Text>
                        <TouchableOpacity style={[styles.uploadBox, {height:60, flexDirection:'row', gap:10}]}>
                            <MaterialCommunityIcons name="file-document" size={24} color={COLORS.purple}/>
                            <Text style={{color: COLORS.purple, fontWeight:'bold'}}>Subir PDF/Foto</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 4 && (
                    <View>
                        <Text style={styles.headerTitle}>Métodos y Términos</Text>
                        <View style={styles.cardOption}>
                            <MaterialCommunityIcons name="wallet" size={24}/>
                            <Text style={{marginLeft:10, fontWeight:'bold'}}>Billetera Móvil / Banco</Text>
                        </View>
                        <View style={{backgroundColor: COLORS.blueLight, padding:15, borderRadius:12, marginVertical:20}}>
                            <Text style={{fontSize:12, color:COLORS.blue}}>
                                Al continuar, aceptas los <Text style={{fontWeight:'bold', textDecorationLine:'underline'}} onPress={() => setShowTerms(true)}>Términos y Condiciones</Text>.
                            </Text>
                            <Text style={{fontSize:10, color:COLORS.blue, marginTop:5}}>* The Source cobra una comisión del 5%.</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Switch value={formData.acceptedTerms} onValueChange={v => setFormData({...formData, acceptedTerms:v})} />
                            <Text style={{marginLeft:10, fontWeight:'bold'}}>Acepto los términos.</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomAction}>
                <TouchableOpacity 
                    style={[styles.primaryButton, step===4 && !formData.acceptedTerms && {opacity:0.5}]} 
                    disabled={step===4 && !formData.acceptedTerms}
                    onPress={step===4 ? () => onComplete(formData) : () => setStep(step+1)}
                >
                    <Text style={styles.primaryButtonText}>{step===4 ? 'Finalizar' : 'Continuar'}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showBonusModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.bonusCard}>
                        <MaterialCommunityIcons name="party-popper" size={50} color={COLORS.yellow}/>
                        <Text style={styles.bonusTitle}>¡FELICIDADES!</Text>
                        <Text style={styles.subText}>Bono de bienvenida inicial.</Text>
                        <Text style={styles.bonusValue}>Bs. {bonusAmount}</Text>
                        <Button title="Ir a mi Panel" onPress={onCloseBonus} />
                    </View>
                </View>
            </Modal>

            <Modal visible={showTerms} animationType="slide">
                <TermsView onBack={() => setShowTerms(false)} />
            </Modal>
        </View>
    );
};

// 3. HOME VIEW (CLIENT)
const HomeView = ({ userData, providers, onSelectProvider, onToggleSearch }) => (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:100}}>
        <View style={styles.header}>
            <View>
                <Text style={{fontSize:10, fontWeight:'bold', color:COLORS.grayText}}>MI PERFIL</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Ionicons name="location" size={14} color={COLORS.red}/>
                    <Text style={{fontWeight:'bold', marginLeft:4}}>{userData.location}</Text>
                </View>
                <Text style={styles.appTitleSmall}>THE SOURCE</Text>
            </View>
            <TouchableOpacity onPress={onToggleSearch} style={styles.iconBtn}>
                <Ionicons name="search" size={24}/>
            </TouchableOpacity>
        </View>

        <View style={styles.specialBanner}>
            <View>
                <Text style={{color:'white', fontWeight:'bold', fontSize:16}}>¿Buscas algo especial?</Text>
                <Text style={{color:'#9CA3AF', fontSize:10}}>Publica y recibe ofertas.</Text>
            </View>
            <MaterialCommunityIcons name="magnify-expand" size={50} color="rgba(255,255,255,0.2)"/>
        </View>

        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft:20}}>
            {CATEGORIES.map((cat, i) => (
                <TouchableOpacity key={cat.id} style={styles.catCard}>
                    <View style={[styles.catIconBox, i===0 && {backgroundColor: COLORS.blueLight, borderColor: COLORS.blue}]}>
                        <MaterialCommunityIcons name={cat.icon} size={24} color={i===0 ? COLORS.blue : COLORS.grayText} />
                    </View>
                    <Text style={[styles.catText, i===0 && {color: COLORS.blue}]}>{cat.label.split(' ')[0]}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recomendados</Text>
        <View style={{paddingHorizontal:20}}>
            {providers.map(p => (
                <TouchableOpacity key={p.id} style={styles.providerCard} onPress={() => onSelectProvider(p)}>
                    <Image source={{uri: p.image}} style={styles.providerImage}/>
                    <View style={{flex:1, padding:10}}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.providerName}>{p.name}</Text>
                            {p.isVerified && <MaterialIcons name="verified" size={16} color={COLORS.blue}/>}
                        </View>
                        <Text style={styles.providerProfession}>{p.professions[0]}</Text>
                        <View style={{flexDirection:'row', gap:5, marginTop:5}}>
                            <View style={styles.badge}><Text style={styles.badgeText}>Bs. {p.price}</Text></View>
                            {p.issuesInvoice && <View style={[styles.badge, {backgroundColor: COLORS.blueLight}]}><Text style={[styles.badgeText, {color: COLORS.blue}]}>Factura</Text></View>}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    </ScrollView>
);

// 4. SEARCH VIEW
const SearchView = ({ providers, onSelectProvider }) => (
    <View style={styles.container}>
        <View style={{padding:20}}>
            <Text style={styles.headerTitle}>Buscar</Text>
            <TextInput style={styles.searchLarge} placeholder="Buscar servicio..." autoFocus />
            <Text style={[styles.sectionTitle, {paddingHorizontal:0, marginTop:20}]}>Resultados</Text>
            <ScrollView>
                {providers.map(p => (
                    <TouchableOpacity key={p.id} style={styles.resultRow} onPress={() => onSelectProvider(p)}>
                        <Image source={{uri: p.image}} style={{width:50, height:50, borderRadius:10}} />
                        <View style={{flex:1, marginLeft:10}}>
                            <Text style={{fontWeight:'bold'}}>{p.name}</Text>
                            <Text style={{color: COLORS.grayText}}>{p.professions[0]}</Text>
                        </View>
                        <Text style={{color: COLORS.blue, fontWeight:'bold'}}>Bs. {p.price}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    </View>
);

// 5. PROFILE DETAIL (CLIENT VIEWING WORKER)
const ProfileDetail = ({ provider, onBack, onSendRequest }) => {
    const [showModal, setShowModal] = useState(false);
    const [msg, setMsg] = useState('');
    const [simAmount, setSimAmount] = useState('');
    const [showSim, setShowSim] = useState(false);

    const shareWhatsapp = () => {
        // En un dispositivo real usarías Linking.openURL
        Alert.alert("Compartir", "Abriendo WhatsApp...");
    };

    const calcPoints = () => {
        const n = parseFloat(simAmount);
        return isNaN(n) ? 0 : Math.floor(n / 10);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{height:300}}>
                    <Image source={{uri: provider.image}} style={{width:'100%', height:'100%'}}/>
                    <View style={styles.overlay}/>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}><Ionicons name="arrow-back" color="white" size={24}/></TouchableOpacity>
                    <View style={{position:'absolute', top:40, right:20, flexDirection:'row', gap:10}}>
                        <TouchableOpacity style={styles.iconBlur} onPress={() => Alert.alert("Reportar")}><MaterialIcons name="flag" color="white" size={20}/></TouchableOpacity>
                        <TouchableOpacity style={styles.iconBlur} onPress={shareWhatsapp}><Ionicons name="logo-whatsapp" color="white" size={20}/></TouchableOpacity>
                    </View>
                    <View style={{position:'absolute', bottom:20, left:20}}>
                        <Text style={{color:'white', fontSize:24, fontWeight:'bold'}}>{provider.name}</Text>
                        <Text style={{color:'white'}}>{provider.professions[0]}</Text>
                    </View>
                </View>

                <View style={styles.profileBody}>
                    <TouchableOpacity style={styles.actionRow} onPress={() => provider.cvUrl ? Alert.alert("CV", "Abriendo documento...") : Alert.alert("Info", "Sin documentos públicos.")}>
                        <MaterialCommunityIcons name="file-document" size={24} color={COLORS.purple}/>
                        <View style={{marginLeft:10}}><Text style={{fontWeight:'bold'}}>Ver Credenciales / CV</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionRow} onPress={() => setShowSim(true)}>
                        <MaterialCommunityIcons name="calculator" size={24} color={COLORS.green}/>
                        <View style={{marginLeft:10}}><Text style={{fontWeight:'bold'}}>Simular Puntos</Text></View>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Tarifas</Text>
                    {provider.tariffs.map((t,i) => (
                        <View key={i} style={styles.tariffItem}>
                            <Text>{t.service}</Text>
                            <Text style={{fontWeight:'bold', color: COLORS.blue}}>Bs. {t.price}</Text>
                        </View>
                    ))}
                    
                    <Text style={styles.sectionTitle}>Sobre mí</Text>
                    <Text style={{color: COLORS.grayText, lineHeight:20}}>{provider.bio}</Text>
                </View>
            </ScrollView>

            <View style={{padding:20, borderTopWidth:1, borderColor:COLORS.grayLight}}>
                <Button title="SOLICITAR SERVICIO" onPress={() => setShowModal(true)} />
            </View>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>
                        <Text style={styles.sheetTitle}>Solicitar Contacto</Text>
                        <TextInput style={[styles.input, {height:80}]} multiline placeholder="Describe tu problema..." value={msg} onChangeText={setMsg}/>
                        <Button title="Enviar Solicitud" onPress={() => { onSendRequest(msg); setShowModal(false); }} />
                        <Button title="Cancelar" variant="outline" onPress={() => setShowModal(false)} />
                    </View>
                </View>
            </Modal>

            <Modal visible={showSim} transparent animationType="slide">
                 <View style={styles.modalOverlay}>
                    <View style={styles.bonusCard}>
                        <MaterialCommunityIcons name="calculator" size={40} color={COLORS.green}/>
                        <Text style={styles.sheetTitle}>Simulador</Text>
                        <Text>10 Bs = 1 Punto</Text>
                        <TextInput style={[styles.input, {textAlign:'center', fontSize:20, fontWeight:'bold'}]} keyboardType="numeric" placeholder="Monto Bs." value={simAmount} onChangeText={setSimAmount}/>
                        {calcPoints() > 0 && <Text style={{fontSize:24, fontWeight:'bold', color:COLORS.blue, marginVertical:10}}>{calcPoints()} Puntos</Text>}
                        <Button title="Cerrar" onPress={() => setShowSim(false)} />
                    </View>
                 </View>
            </Modal>
        </View>
    );
};

// 6. CLIENT JOB POST
const ClientJobPost = ({ onClose, onSubmit }) => {
    const [invoice, setInvoice] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.simpleHeader}>
                <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24}/></TouchableOpacity>
                <Text style={styles.headerTitleInline}>Publicar Solicitud</Text>
                <View style={{width:24}}/>
            </View>
            <ScrollView contentContainerStyle={{padding:20}}>
                <Input label="¿Qué buscas?" placeholder="Ej. Plomero"/>
                <Text style={styles.label}>Detalles</Text>
                <TextInput style={[styles.input, {height:100}]} multiline placeholder="Describe el trabajo..."/>
                <View style={styles.invoiceRow}>
                    <Text>¿Requiere Factura?</Text>
                    <Switch value={invoice} onValueChange={setInvoice} trackColor={{true: COLORS.blue}}/>
                </View>
                <Input label="Presupuesto (Opcional)" keyboardType="numeric"/>
                <Input label="Teléfono de contacto" keyboardType="phone-pad"/>
                <Button title="Publicar Ahora" onPress={onSubmit}/>
            </ScrollView>
        </View>
    );
};

// 7. CLIENT PROFILE
const ClientProfileView = ({ profile, onNavigate }) => (
    <ScrollView style={styles.container}>
        <View style={{padding:20}}>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom:20}}>
                <Image source={{uri: profile.image || 'https://via.placeholder.com/100'}} style={{width:60, height:60, borderRadius:30, backgroundColor: COLORS.grayLight}} />
                <View style={{marginLeft:15}}>
                    <Text style={{fontSize:18, fontWeight:'bold'}}>{profile.name}</Text>
                    <Text style={{color: COLORS.grayText}}>{profile.email}</Text>
                </View>
            </View>

            <View style={styles.pointsCard}>
                <Text style={{color:'rgba(255,255,255,0.7)', fontSize:10, fontWeight:'bold'}}>MIS PUNTOS</Text>
                <Text style={{color:'white', fontSize:40, fontWeight:'900'}}>{profile.loyaltyPoints}</Text>
                <Text style={{color:'rgba(255,255,255,0.7)', fontSize:10}}>10 Bs = 1 Punto</Text>
                <TouchableOpacity style={{position:'absolute', top:20, right:20}}><MaterialCommunityIcons name="calculator" color="white" size={20}/></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.promoCard} onPress={() => onNavigate('ONBOARDING_PROVIDER')}>
                <Text style={{color:'white', fontWeight:'bold', fontSize:16}}>¿Ofreces servicios?</Text>
                <Text style={{color:'white', fontSize:12}}>Crea tu perfil de trabajador.</Text>
            </TouchableOpacity>

            <View style={{marginTop:20}}>
                <MenuOption icon="help-circle" label="Ayuda y Soporte" onPress={() => onNavigate('HELP')}/>
                <MenuOption icon="file-document" label="Términos de Uso" onPress={() => onNavigate('TERMS')}/>
                <View style={{height:20}}/>
                <Button title="Panel Administrador" onPress={() => onNavigate('ADMIN')} variant="black" />
            </View>
        </View>
    </ScrollView>
);

// 8. WORKER DASHBOARD
const WorkerDashboard = ({ userData, leads, onUnlock, onViewLead }) => {
    const [activeTab, setActiveTab] = useState('LOCKED');
    
    // Filtro Leads
    const unlockedIds = userData.unlockedLeads || [];
    const displayLeads = leads.filter(l => activeTab === 'LOCKED' ? !unlockedIds.includes(l.id) : unlockedIds.includes(l.id));

    return (
        <View style={styles.container}>
            <View style={{padding:20, backgroundColor:'white', borderBottomWidth:1, borderColor: COLORS.grayLight}}>
                <Text style={styles.headerTitle}>Solicitudes</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('LOCKED')} style={[styles.tabBtn, activeTab==='LOCKED' && styles.tabBtnActive]}>
                        <Text style={[styles.tabText, activeTab==='LOCKED' && {color: COLORS.black}]}>Nuevas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('UNLOCKED')} style={[styles.tabBtn, activeTab==='UNLOCKED' && styles.tabBtnActive]}>
                        <Text style={[styles.tabText, activeTab==='UNLOCKED' && {color: COLORS.black}]}>Desbloqueadas</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={{padding:20}}>
                {displayLeads.length === 0 && <Text style={{textAlign:'center', marginTop:50, color:COLORS.grayText}}>No hay solicitudes aquí.</Text>}
                {displayLeads.map(lead => (
                    <View key={lead.id} style={styles.leadCard}>
                        <View style={[styles.leadStripe, {backgroundColor: activeTab==='LOCKED' ? COLORS.blue : COLORS.green}]}/>
                        <View style={{padding:15, paddingLeft:20}}>
                            <View style={styles.rowBetween}>
                                <Text style={{fontWeight:'bold'}}>{lead.clientName}</Text>
                                <Text style={{fontSize:10, color: COLORS.grayText}}>{lead.date}</Text>
                            </View>
                            <Text style={{color: COLORS.blue, fontSize:12, fontWeight:'bold'}}>{lead.category}</Text>
                            <Text style={{color: COLORS.grayText, fontStyle:'italic', marginVertical:10}}>"{lead.message}"</Text>
                            
                            {activeTab === 'LOCKED' ? (
                                <View>
                                    <View style={styles.rowBetween}>
                                        <Text style={{fontSize:10, color:COLORS.red}}><Ionicons name="lock-closed" size={10}/> Contacto Bloqueado</Text>
                                        <Text style={{fontWeight:'bold', color: COLORS.red}}>-3 Bs</Text>
                                    </View>
                                    <Button title="Desbloquear y Contactar" onPress={() => onUnlock(lead.id)} style={{marginTop:10}} />
                                </View>
                            ) : (
                                <Button title="Ver Perfil y Contactar" onPress={() => onViewLead(lead)} variant="secondary" style={{backgroundColor: COLORS.green}} />
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// 9. LEAD DETAIL (PROFILE OF CLIENT)
const LeadDetailView = ({ lead, onBack }) => {
    const [msgModal, setMsgModal] = useState(false);
    return (
        <View style={styles.container}>
            <View style={{height:200, backgroundColor: COLORS.blue, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}><Ionicons name="arrow-back" color="white" size={24}/></TouchableOpacity>
                <Image source={{uri: lead.avatar}} style={{width:100, height:100, borderRadius:50, borderWidth:4, borderColor:'white'}}/>
                <Text style={{color:'white', fontWeight:'bold', fontSize:20, marginTop:10}}>{lead.clientName}</Text>
                <Text style={{color:'rgba(255,255,255,0.8)'}}><Ionicons name="location" size={12}/> {lead.location}</Text>
            </View>

            <View style={{padding:20}}>
                <View style={{flexDirection:'row', gap:10, marginBottom:20}}>
                    <TouchableOpacity style={styles.contactBtn} onPress={() => Alert.alert("Llamando...")}>
                        <Ionicons name="call" size={20} color={COLORS.blue}/>
                        <Text style={{fontSize:10, fontWeight:'bold', marginTop:5}}>Llamar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactBtn, {backgroundColor: COLORS.greenLight}]} onPress={() => Alert.alert("WhatsApp", "Abriendo...")}>
                        <Ionicons name="logo-whatsapp" size={20} color={COLORS.green}/>
                        <Text style={{fontSize:10, fontWeight:'bold', marginTop:5}}>WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactBtn, {backgroundColor: COLORS.grayLight}]} onPress={() => setMsgModal(true)}>
                        <MaterialCommunityIcons name="message" size={20} color={COLORS.black}/>
                        <Text style={{fontSize:10, fontWeight:'bold', marginTop:5}}>Mensaje</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={{fontWeight:'bold', marginBottom:10}}>Detalle de Solicitud</Text>
                    <Text style={{color: COLORS.grayText}}>{lead.message}</Text>
                    <View style={{marginTop:15, flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{fontWeight:'bold', fontSize:12, color: COLORS.grayText}}>PRESUPUESTO</Text>
                        <Text style={{fontWeight:'bold', color: COLORS.green}}>{lead.budget}</Text>
                    </View>
                </View>
            </View>

            <Modal visible={msgModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.bonusCard}>
                        <Text style={styles.sheetTitle}>Enviar Mensaje</Text>
                        <TextInput style={[styles.input, {height:80}]} multiline placeholder="Escribe aquí..."/>
                        <Button title="Enviar" onPress={() => setMsgModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// 10. WALL / OPPORTUNITIES
const OpportunitiesView = ({ jobPosts }) => (
    <View style={styles.container}>
        <View style={styles.wallHeader}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaterialCommunityIcons name="monitor" color={COLORS.yellow} size={24} style={{marginRight:10}}/>
                <View>
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>MURO DE EMPLEOS</Text>
                    <Text style={{color:'gray', fontSize:10}}>Oportunidades públicas</Text>
                </View>
            </View>
        </View>
        <ScrollView contentContainerStyle={{padding:20}}>
            {jobPosts.map(post => (
                <View key={post.id} style={styles.jobCard}>
                    <View style={styles.jobHeader}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{post.category}</Text></View>
                        <Text style={{fontSize:10, color: COLORS.grayText}}>{post.date}</Text>
                    </View>
                    <View style={{padding:15}}>
                        <Text style={{fontWeight:'bold', fontSize:16, marginBottom:5}}>{post.title}</Text>
                        <Text style={{color: COLORS.grayText, fontSize:12, marginBottom:10}}>{post.description}</Text>
                        <View style={{flexDirection:'row', gap:10}}>
                            <View style={styles.miniTag}><Ionicons name="location" size={10} color="gray"/><Text style={{fontSize:10, color:'gray', marginLeft:4}}>{post.location}</Text></View>
                            <View style={styles.miniTag}><Ionicons name="wallet" size={10} color="gray"/><Text style={{fontSize:10, color:'gray', marginLeft:4}}>{post.budget}</Text></View>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    </View>
);

// 11. WALLET
const WalletView = ({ userData, onRecharge }) => (
    <ScrollView style={styles.container} contentContainerStyle={{padding:20}}>
        <Text style={styles.headerTitle}>Billetera</Text>
        <View style={styles.walletCard}>
            <View style={{backgroundColor:'white', padding:10, borderRadius:10, alignSelf:'center', marginBottom:10}}>
                <Image source={{uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AdminRecharge'}} style={{width:100, height:100}}/>
            </View>
            <Text style={{color:'gray', fontSize:10, fontWeight:'bold', textAlign:'center'}}>SALDO DISPONIBLE</Text>
            <Text style={{color:'white', fontSize:36, fontWeight:'900', textAlign:'center'}}>Bs. {userData.walletBalance.toFixed(2)}</Text>
            <Text style={{color:'gray', fontSize:10, textAlign:'center', marginTop:10}}>Escanea este QR para recargar con el Admin.</Text>
        </View>

        <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="history" size={24} color={COLORS.blue}/>
            <Text style={{flex:1, marginLeft:10, fontWeight:'bold'}}>Historial de Transacciones</Text>
            <Ionicons name="chevron-forward" size={20} color="gray"/>
        </TouchableOpacity>

        <View style={styles.rechargeBox}>
            <Text style={{fontWeight:'bold', fontSize:16, textAlign:'center'}}>Reportar Pago</Text>
            <Text style={{textAlign:'center', color:COLORS.grayText, fontSize:12, marginBottom:15}}>Si ya hiciste la transferencia al QR de arriba, sube tu comprobante.</Text>
            <Button title="Subir Comprobante" onPress={() => onRecharge(50)} variant="black" />
        </View>
    </ScrollView>
);

// 12. MY SERVICES PANEL
const MyServicesPanel = ({ userData, onNavigate }) => (
    <ScrollView style={styles.container} contentContainerStyle={{padding:20}}>
        <Text style={styles.headerTitle}>Mi Panel</Text>
        <View style={styles.panelHeader}>
            <Text style={{color:'gray', fontSize:10, fontWeight:'bold'}}>SALDO ACTUAL</Text>
            <Text style={{color:'white', fontSize:32, fontWeight:'bold', marginVertical:5}}>Bs. {userData.walletBalance.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => onNavigate('WALLET')} style={styles.walletBtnSmall}>
                <Ionicons name="wallet" size={14} color="white"/>
                <Text style={{color:'white', fontSize:10, fontWeight:'bold', marginLeft:5}}>Gestionar</Text>
            </TouchableOpacity>
        </View>

        <MenuOption icon="file-document" label="Curriculum Vitae" onPress={() => Alert.alert("CV")} />
        <MenuOption icon="handshake" label="Simular Cierre de Trabajo" onPress={() => onNavigate('JOB_CLOSING')} />
        
        <TouchableOpacity style={styles.switchModeBtn} onPress={() => onNavigate('HIRE_MODE')}>
            <Text style={{fontWeight:'bold'}}>Contratar Servicios</Text>
            <Text style={{fontSize:10, color: COLORS.grayText}}>Cambiar a modo Cliente</Text>
        </TouchableOpacity>
    </ScrollView>
);

// 13. JOB CLOSING SIMULATION
const JobClosingSimulation = ({ onSuccess, onClose }) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const numAmount = parseFloat(amount) || 0;
    const commission = numAmount * 0.05;
    const net = numAmount - commission;

    return (
        <View style={styles.container}>
            <View style={styles.simpleHeader}>
                <Text style={styles.headerTitleInline}>Cierre de Trabajo</Text>
                <TouchableOpacity onPress={onClose}><Ionicons name="arrow-down" size={24}/></TouchableOpacity>
            </View>
            <View style={{flex:1, justifyContent:'center', padding:20}}>
                {step === 1 ? (
                    <View>
                        <Text style={{textAlign:'center', fontSize:18, fontWeight:'bold'}}>Ingresa Monto Total</Text>
                        <Text style={{textAlign:'center', color:'gray', marginBottom:20}}>Cobrado al cliente</Text>
                        <TextInput style={styles.bigInput} placeholder="0" keyboardType="numeric" value={amount} onChangeText={setAmount} autoFocus />
                        {numAmount > 0 && (
                            <View style={styles.calcBox}>
                                <View style={styles.rowBetween}><Text>Total:</Text><Text>Bs. {numAmount}</Text></View>
                                <View style={styles.rowBetween}><Text style={{color:COLORS.red}}>Comisión (5%):</Text><Text style={{color:COLORS.red}}>- {commission.toFixed(2)}</Text></View>
                                <View style={[styles.rowBetween, {borderTopWidth:1, marginTop:5, paddingTop:5}]}><Text style={{fontWeight:'bold'}}>Recibes Neto:</Text><Text style={{fontWeight:'bold'}}>Bs. {net.toFixed(2)}</Text></View>
                            </View>
                        )}
                        <Button title="Solicitar Confirmación" onPress={() => setStep(2)} disabled={numAmount <= 0} />
                    </View>
                ) : (
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold', marginBottom:20}}>Cliente: Confirma Pago</Text>
                        <View style={styles.pointsPromoCard}>
                            <Text style={{color: COLORS.yellow, fontWeight:'bold', fontSize:18}}>¡GANA PUNTOS!</Text>
                            <Text style={{color:'white', textAlign:'center', marginTop:10}}>Si confirmas el pago de Bs. {amount}, ganarás:</Text>
                            <Text style={{color: COLORS.yellow, fontSize:40, fontWeight:'900'}}>{Math.floor(numAmount/10)}</Text>
                            <Text style={{color:'white', fontSize:10}}>PUNTOS</Text>
                        </View>
                        <Button title="Confirmar y Ganar" onPress={() => onSuccess(Math.floor(numAmount/10))} style={{backgroundColor: COLORS.green, width:'100%'}} />
                    </View>
                )}
            </View>
        </View>
    );
};

// 14. ADMIN DASHBOARD
const AdminDashboard = ({ adminData, onBack, onApproveRecharge, onManualRecharge }) => {
    const [tab, setTab] = useState('finances');
    const [manualWorker, setManualWorker] = useState('');
    const [manualAmount, setManualAmount] = useState('');

    const tabs = [
        { id: 'finances', label: 'Finanzas', icon: 'cash' },
        { id: 'statistics', label: 'Estadísticas', icon: 'chart-bar' },
        { id: 'users', label: 'Usuarios', icon: 'account-group' },
        { id: 'payments', label: 'Pagos', icon: 'credit-card' },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.adminHeader}>
                <TouchableOpacity onPress={onBack} style={styles.backButtonSmall}><Ionicons name="arrow-back" size={20}/></TouchableOpacity>
                <Text style={styles.adminTitle}>ADMINISTRATOR PANEL</Text>
            </View>

            <View style={styles.adminGrid}>
                {tabs.map(t => (
                    <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[styles.adminTab, tab===t.id && styles.adminTabActive]}>
                        <MaterialCommunityIcons name={t.icon} size={24} color={tab===t.id ? 'white' : 'gray'}/>
                        <Text style={[styles.adminTabText, tab===t.id && {color:'white'}]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{padding:20}}>
                {tab === 'finances' && (
                    <View>
                        <View style={styles.revenueCard}>
                            <Text style={{color:'gray', fontSize:10, fontWeight:'bold'}}>INGRESOS TOTALES (5%)</Text>
                            <Text style={{color:'white', fontSize:36, fontWeight:'bold'}}>Bs. {adminData.revenue}</Text>
                        </View>
                        <Text style={styles.label}>Solicitudes de Recarga</Text>
                        {adminData.pendingRecharges.map(tx => (
                            <View key={tx.id} style={styles.rechargeItem}>
                                <View>
                                    <Text style={{fontWeight:'bold'}}>{tx.workerName}</Text>
                                    <Text style={{fontSize:10, color:'gray'}}>Comp. #{tx.id}</Text>
                                </View>
                                <View style={{alignItems:'flex-end'}}>
                                    <Text style={{fontWeight:'bold', color: COLORS.blue}}>Bs. {tx.amount}</Text>
                                    <View style={{flexDirection:'row', gap:5, marginTop:5}}>
                                        <TouchableOpacity onPress={() => onApproveRecharge(tx.id)} style={styles.approveBtn}><Ionicons name="checkmark" color="white" size={12}/></TouchableOpacity>
                                        <TouchableOpacity style={[styles.approveBtn, {backgroundColor: COLORS.red}]}><Ionicons name="close" color="white" size={12}/></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                        <View style={styles.manualBox}>
                            <Text style={{fontWeight:'bold'}}>Recarga Manual</Text>
                            <Input placeholder="Nombre Trabajador" value={manualWorker} onChangeText={setManualWorker}/>
                            <Input placeholder="Monto" keyboardType="numeric" value={manualAmount} onChangeText={setManualAmount}/>
                            <Button title="Recargar" onPress={() => { onManualRecharge(manualWorker, manualAmount); setManualWorker(''); setManualAmount(''); }} />
                        </View>
                    </View>
                )}
                {/* Otros tabs simplificados por espacio */}
                {tab === 'users' && <Text>Lista de Usuarios (Clientes/Trabajadores)</Text>}
                {tab === 'statistics' && <Text>Gráficos y Auditorías</Text>}
                {tab === 'payments' && <Text>Configuración de QRs del Admin</Text>}
            </View>
        </ScrollView>
    );
};

// COMPONENTES AUXILIARES
const TermsView = ({ onBack }) => (
    <View style={styles.container}>
        <View style={styles.simpleHeader}><TouchableOpacity onPress={onBack}><Ionicons name="arrow-back" size={24}/></TouchableOpacity><Text style={styles.headerTitleInline}>Términos</Text></View>
        <ScrollView style={{padding:20}}><Text style={{textAlign:'justify', lineHeight:20}}>Términos y Condiciones: The Source cobra 5% de comisión...</Text></ScrollView>
    </View>
);
const HelpCenter = ({ onBack }) => (
    <View style={styles.container}>
        <View style={styles.simpleHeader}><TouchableOpacity onPress={onBack}><Ionicons name="arrow-back" size={24}/></TouchableOpacity><Text style={styles.headerTitleInline}>Ayuda</Text></View>
        <View style={{padding:20}}><Text>Soporte técnico...</Text></View>
    </View>
);

const Input = ({ label, ...props }) => (
    <View style={{marginBottom:15}}>
        {label && <Text style={styles.inputLabel}>{label}</Text>}
        <TextInput style={styles.input} {...props} />
    </View>
);

const Button = ({ title, onPress, variant='primary', style, disabled, icon:Icon }) => (
    <TouchableOpacity 
        style={[styles.primaryButton, variant==='secondary' && {backgroundColor: COLORS.blue}, variant==='outline' && {backgroundColor:'transparent', borderWidth:1, borderColor: COLORS.grayLight}, variant==='black' && {backgroundColor: COLORS.black}, disabled && {opacity:0.5}, style]} 
        onPress={onPress}
        disabled={disabled}
    >
        {Icon && <Icon size={20} color={variant==='outline' ? 'black' : 'white'} style={{marginRight:5}} />}
        <Text style={[styles.primaryButtonText, variant==='outline' && {color: COLORS.black}]}>{title}</Text>
    </TouchableOpacity>
);

const MenuOption = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={20} color={COLORS.black}/>
        <Text style={{flex:1, marginLeft:10, fontWeight:'500'}}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color="gray"/>
    </TouchableOpacity>
);

const BottomNavigation = ({ currentTab, userType, onTabPress }) => (
    <View style={styles.navBar}>
       {userType === 'CLIENT' || currentTab === 'HOME' ? (
          <>
            <NavIcon icon="home" label="Inicio" active={currentTab === 'HOME'} onPress={() => onTabPress('HOME')} />
            <NavIcon icon="search" label="Buscar" active={currentTab === 'SEARCH'} onPress={() => onTabPress('SEARCH')} />
            <NavIcon icon="add-circle-outline" label="Pedir" active={currentTab === 'REQUEST_SERVICE'} onPress={() => onTabPress('REQUEST_SERVICE')} />
            <NavIcon icon="person" label="Perfil" active={currentTab === 'CLIENT_PROFILE'} onPress={() => onTabPress('CLIENT_PROFILE')} />
          </>
       ) : (
          <>
            <NavIcon icon="mail" label="Solicitudes" active={currentTab === 'WORKER_DASHBOARD'} onPress={() => onTabPress('WORKER_DASHBOARD')} />
            <NavIcon icon="grid" label="Panel" active={currentTab === 'MY_SERVICES'} onPress={() => onTabPress('MY_SERVICES')} />
            <NavIcon icon="desktop-outline" label="Muro" active={currentTab === 'OPPORTUNITIES'} onPress={() => onTabPress('OPPORTUNITIES')} />
            <NavIcon icon="wallet" label="Billetera" active={currentTab === 'WALLET'} onPress={() => onTabPress('WALLET')} />
          </>
       )}
    </View>
);

const NavIcon = ({ icon, label, active, onPress }) => (
    <TouchableOpacity style={{alignItems:'center'}} onPress={onPress}>
        <Ionicons name={icon} size={24} color={active ? COLORS.blue : '#9CA3AF'} />
        <Text style={{fontSize:10, color: active ? COLORS.blue : '#9CA3AF', marginTop:2}}>{label}</Text>
    </TouchableOpacity>
);

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    contentContainer: { flex: 1, paddingBottom: 60 },
    
    // Login
    loginContainer: { flexGrow: 1, padding: 24, backgroundColor: COLORS.white, justifyContent:'center' },
    logoBox: { width: 80, height: 80, backgroundColor: COLORS.black, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    logoLetter: { color: COLORS.white, fontSize: 40, fontWeight: '900' },
    appTitle: { fontSize: 32, fontWeight: '900', color: COLORS.black },
    appSubtitle: { fontSize: 12, fontWeight: 'bold', color: COLORS.blue, letterSpacing: 2 },
    inputLabel: { fontWeight:'bold', marginBottom:5, fontSize:14 },
    input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.grayLight, borderRadius: 16, padding: 15, marginBottom: 15, fontSize: 16 },
    socialButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, justifyContent:'center' },
    socialText: { fontWeight: 'bold', marginLeft:10 },
    primaryButton: { backgroundColor: COLORS.black, borderRadius: 16, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, width:'100%' },
    primaryButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16, marginRight: 8 },
    avatarOption: { width:60, height:60, borderRadius:30, backgroundColor: COLORS.grayLight },

    // Headers
    header: { padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor:'white' },
    appTitleSmall: { fontSize: 20, fontWeight: '900' },
    iconBtn: { padding: 8, backgroundColor: COLORS.grayLight, borderRadius: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    simpleHeader: { padding:20, paddingTop:40, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderColor: COLORS.grayLight },
    headerTitleInline: { fontSize:18, fontWeight:'bold' },

    // Cards & Lists
    specialBanner: { backgroundColor: COLORS.black, margin: 20, borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 12, marginTop: 10 },
    catCard: { alignItems: 'center', marginRight: 15 },
    catIconBox: { width: 60, height: 60, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.grayLight, marginBottom:5 },
    catText: { fontSize: 10, fontWeight: 'bold', color: COLORS.grayText },
    providerCard: { flexDirection:'row', backgroundColor: COLORS.white, padding:10, borderRadius:16, marginBottom:15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    providerImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.grayLight },
    providerName: { fontWeight: 'bold', fontSize: 16 },
    providerProfession: { fontSize: 12, color: COLORS.grayText },
    badge: { backgroundColor: COLORS.greenLight, paddingHorizontal:8, paddingVertical:4, borderRadius:8, alignSelf:'flex-start' },
    badgeText: { fontSize:10, fontWeight:'bold', color: COLORS.green },
    
    // Search
    searchLarge: { fontSize:18, padding:15, backgroundColor:'white', borderRadius:16, borderWidth:1, borderColor:COLORS.grayLight },
    resultRow: { flexDirection:'row', alignItems:'center', padding:15, backgroundColor:'white', marginBottom:10, borderRadius:12, borderWidth:1, borderColor:COLORS.grayLight },

    // Profile Detail
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    backButton: { position: 'absolute', top: 40, left: 20, padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
    iconBlur: { padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
    profileBody: { padding: 20, backgroundColor: COLORS.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
    actionRow: { flexDirection:'row', alignItems:'center', padding:15, backgroundColor:'white', borderRadius:16, marginBottom:10, borderWidth:1, borderColor:COLORS.grayLight },
    tariffItem: { flexDirection:'row', justifyContent:'space-between', padding:15, borderBottomWidth:1, borderColor: COLORS.grayLight, backgroundColor:'white' },

    // Client Profile
    pointsCard: { backgroundColor: COLORS.black, padding:20, borderRadius:20, marginBottom:20, minHeight:120, justifyContent:'center' },
    promoCard: { backgroundColor: COLORS.blue, padding:20, borderRadius:20, marginBottom:20 },
    menuItem: { flexDirection:'row', alignItems:'center', padding:15, backgroundColor:'white', borderRadius:16, marginBottom:10, borderWidth:1, borderColor:COLORS.grayLight },
    
    // Onboarding
    progressHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, paddingTop:40 },
    progressDot: { width:8, height:8, borderRadius:4, backgroundColor:COLORS.grayLight },
    chipContainer: { flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:20 },
    chip: { flexDirection:'row', padding:10, borderRadius:12, borderWidth:1, borderColor:COLORS.grayLight, backgroundColor:'white', alignItems:'center' },
    chipActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    chipText: { fontSize:12, marginLeft:5 },
    invoiceRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'white', padding:15, borderRadius:12, marginBottom:10, borderWidth:1, borderColor:COLORS.grayLight },
    tariffRow: { flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'white', marginBottom:5, borderRadius:8 },
    addTariffBox: { backgroundColor: COLORS.grayLight, padding:10, borderRadius:12, marginTop:10 },
    subText: { color: COLORS.grayText, marginBottom: 20 },
    uploadBox: { flex:1, height:100, borderRadius:12, borderStyle:'dashed', borderWidth:2, borderColor: COLORS.blue, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.blueLight },
    smallText: { fontSize:10, color: COLORS.blue, fontWeight:'bold', marginTop:5 },
    cardOption: { flexDirection:'row', padding:20, backgroundColor:'white', borderRadius:16, borderWidth:1, borderColor:COLORS.grayLight, alignItems:'center' },
    bottomAction: { padding:20, backgroundColor:'white', borderTopWidth:1, borderColor: COLORS.grayLight },

    // Worker Dashboard
    tabContainer: { flexDirection:'row', backgroundColor: COLORS.grayLight, padding:4, borderRadius:12, marginTop:10 },
    tabBtn: { flex:1, paddingVertical:8, alignItems:'center', borderRadius:8 },
    tabBtnActive: { backgroundColor:'white' },
    tabText: { fontSize:12, fontWeight:'bold', color: COLORS.grayText },
    leadCard: { backgroundColor:'white', borderRadius:16, marginBottom:15, overflow:'hidden', borderWidth:1, borderColor:COLORS.grayLight, flexDirection:'row' },
    leadStripe: { width:5 },
    rowBetween: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },

    // Lead Detail
    contactBtn: { flex:1, padding:15, backgroundColor: COLORS.blueLight, borderRadius:12, alignItems:'center', justifyContent:'center' },
    infoCard: { padding:20, backgroundColor: COLORS.background, borderRadius:16, marginTop:20 },

    // Wall
    wallHeader: { padding:20, paddingTop:40, backgroundColor: COLORS.black },
    jobCard: { backgroundColor:'white', borderRadius:12, marginBottom:15, borderWidth:1, borderColor:COLORS.grayLight, overflow:'hidden' },
    jobHeader: { flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor: COLORS.yellow+'20', borderBottomWidth:1, borderColor: COLORS.yellow+'40' },
    miniTag: { flexDirection:'row', backgroundColor: COLORS.grayLight, padding:5, borderRadius:5, alignItems:'center' },

    // Wallet
    walletCard: { backgroundColor: COLORS.black, padding:30, borderRadius:24, marginBottom:20, alignItems:'center' },
    rechargeBox: { backgroundColor:'white', padding:20, borderRadius:20, borderWidth:1, borderColor:COLORS.grayLight, marginTop:20 },
    
    // Admin
    adminHeader: { padding:20, paddingTop:40, flexDirection:'row', alignItems:'center', backgroundColor:'white', borderBottomWidth:1, borderColor:COLORS.grayLight },
    backButtonSmall: { padding:8, backgroundColor:COLORS.grayLight, borderRadius:10, marginRight:10 },
    adminTitle: { fontWeight:'900', fontSize:16 },
    adminGrid: { flexDirection:'row', flexWrap:'wrap', padding:10 },
    adminTab: { width:'23%', alignItems:'center', padding:10, margin: '1%', borderRadius:10 },
    adminTabActive: { backgroundColor: COLORS.black },
    adminTabText: { fontSize:10, fontWeight:'bold', color:'gray', marginTop:5 },
    revenueCard: { backgroundColor: COLORS.black, padding:20, borderRadius:20, marginBottom:20, alignItems:'center' },
    rechargeItem: { flexDirection:'row', justifyContent:'space-between', padding:15, backgroundColor:'white', marginBottom:10, borderRadius:12, borderWidth:1, borderColor:COLORS.grayLight },
    approveBtn: { padding:8, backgroundColor: COLORS.green, borderRadius:8 },
    manualBox: { backgroundColor:'white', padding:15, borderRadius:16, borderWidth:1, borderColor:COLORS.grayLight, marginTop:20 },

    // Simulation
    bigInput: { fontSize:40, textAlign:'center', fontWeight:'bold', marginVertical:20 },
    calcBox: { backgroundColor: COLORS.grayLight, padding:15, borderRadius:12, width:'100%', marginBottom:20 },
    pointsPromoCard: { backgroundColor: COLORS.black, padding:30, borderRadius:24, width:'100%', alignItems:'center', marginBottom:20 },

    // Modal
    modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
    bottomSheet: { backgroundColor:'white', borderTopLeftRadius:24, borderTopRightRadius:24, padding:24 },
    sheetTitle: { fontSize:18, fontWeight:'bold', marginBottom:15 },
    bonusCard: { backgroundColor:'white', margin:20, borderRadius:24, padding:30, alignItems:'center', alignSelf:'center', width:'90%' },
    bonusTitle: { fontSize:24, fontWeight:'900', marginTop:10 },
    bonusValue: { fontSize:40, fontWeight:'900', color: COLORS.yellow, marginVertical:10 },

    navBar: { flexDirection: 'row', backgroundColor: COLORS.white, paddingVertical: 10, paddingBottom: 20, borderTopWidth: 1, borderColor: COLORS.grayLight, justifyContent: 'space-around', position:'absolute', bottom:0, width:'100%' },
});