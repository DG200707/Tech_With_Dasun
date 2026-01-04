
// ===== PASSWORD SETUP =====
// CHANGE THIS PASSWORD TO YOUR OWN SECURE PASSWORD
const ADMIN_PASSWORD = "dasun123"; // You can change this to any password you want

// ===== WHATSAPP CONTACT =====
const WHATSAPP_NUMBER = "0743277981";

// Function to open WhatsApp
function openWhatsApp(serviceName) {
  const message = `Hello! I'm interested in your "${serviceName}" service. Please provide more details.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Function to open WhatsApp for buying password
function buyPassword() {
  const message = `Hello Tech With Dasun! I want to buy the admin password for your store website. Please provide details about pricing and payment.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ===== ENCRYPTION FUNCTIONS =====
function simpleEncrypt(text) {
  return btoa(text);
}

function simpleDecrypt(text) {
  try {
    return atob(text);
  } catch {
    return null;
  }
}

// ===== STATE MANAGEMENT =====
let isAdminLoggedIn = false;
let editServiceId = null;

// ===== BACKGROUND ANIMATIONS =====
function createMatrixRain() {
  const matrixRain = document.getElementById('matrixRain');
  const characters = '01';
  const columns = Math.floor(window.innerWidth / 20);
  
  for (let i = 0; i < columns; i++) {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';
    raindrop.style.left = `${(i * 20) + Math.random() * 20}px`;
    raindrop.style.animationDuration = `${Math.random() * 3 + 2}s`;
    raindrop.style.animationDelay = `${Math.random() * 2}s`;
    raindrop.textContent = characters[Math.floor(Math.random() * characters.length)];
    matrixRain.appendChild(raindrop);
    
    // Create multiple characters in one column
    for (let j = 0; j < Math.floor(Math.random() * 10) + 5; j++) {
      setTimeout(() => {
        const char = document.createElement('div');
        char.className = 'raindrop';
        char.style.left = `${(i * 20) + Math.random() * 20}px`;
        char.style.top = `-${Math.random() * 100}px`;
        char.style.animationDuration = `${Math.random() * 3 + 2}s`;
        char.style.animationDelay = `${Math.random() * 2 + j * 0.2}s`;
        char.textContent = characters[Math.floor(Math.random() * characters.length)];
        char.style.opacity = Math.random() * 0.5 + 0.3;
        matrixRain.appendChild(char);
        
        // Remove character after animation
        setTimeout(() => {
          if (char.parentNode) {
            char.parentNode.removeChild(char);
          }
        }, (parseFloat(char.style.animationDuration) + parseFloat(char.style.animationDelay)) * 1000);
      }, j * 200);
    }
  }
}

// ===== EXISTING FUNCTIONS =====
function toggleMenu(){
  const m=document.getElementById("menu");
  m.style.display=m.style.display==="block"?"none":"block";
}

function openPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.getElementById("menu").style.display="none";
  window.scrollTo(0,0);
  
  // Initialize store page if opened
  if (id === 'store') {
    initializeStorePage();
  }
}

const audio=document.getElementById("audio");
const icon=document.getElementById("icon");
const time=document.getElementById("time");

function toggleAudio(){
  if(audio.paused){
    audio.play();
    icon.className="fas fa-pause";
  }else{
    audio.pause();
    icon.className="fas fa-play";
  }
}

audio.ontimeupdate=()=>{
  let m=Math.floor(audio.currentTime/60);
  let s=Math.floor(audio.currentTime%60).toString().padStart(2,"0");
  time.textContent=`${m}:${s}`;
}

// ===== ADMIN FUNCTIONS =====
function toggleAdminLogin() {
  const loginForm = document.getElementById('adminLoginForm');
  const loginBtn = document.getElementById('adminLoginBtn');
  
  if (isAdminLoggedIn) {
    logoutAdmin();
    return;
  }
  
  if (loginForm.style.display === 'none' || loginForm.style.display === '') {
    loginForm.style.display = 'block';
    loginBtn.classList.add('admin-active');
    loginForm.scrollIntoView({ behavior: 'smooth' });
  } else {
    closeAdminLogin();
  }
}

function closeAdminLogin() {
  document.getElementById('adminLoginForm').style.display = 'none';
  document.getElementById('adminLoginBtn').classList.remove('admin-active');
  document.getElementById('adminPassword').value = '';
}

function adminLogin() {
  const password = document.getElementById('adminPassword').value;
  
  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    document.getElementById('adminPanel').classList.add('active');
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('adminLoginBtn').innerHTML = '<i class="fas fa-user-cog"></i>';
    document.getElementById('editModeIndicator').classList.add('active');
    
    // Show admin controls on service boxes
    showAdminControls();
    
    alert('Admin login successful! You can now edit services.');
  } else {
    alert('Incorrect password! Only you can access the admin panel.');
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').focus();
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  document.getElementById('adminPanel').classList.remove('active');
  document.getElementById('adminLoginBtn').innerHTML = '<i class="fas fa-lock"></i>';
  document.getElementById('adminLoginBtn').classList.remove('admin-active');
  document.getElementById('editModeIndicator').classList.remove('active');
  
  // Hide admin controls on service boxes
  hideAdminControls();
  
  // Clear form
  clearForm();
  
  alert('Admin logged out successfully.');
}

// ===== STORE PAGE FUNCTIONS =====
function initializeStorePage() {
  loadServices();
  
  // Setup form submission
  document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveService();
  });
  
  // Check if admin was previously logged in
  const savedLogin = localStorage.getItem('techDasunAdminLoggedIn');
  if (savedLogin === 'true') {
    // Auto login if session exists
    isAdminLoggedIn = true;
    document.getElementById('adminPanel').classList.add('active');
    document.getElementById('adminLoginBtn').innerHTML = '<i class="fas fa-user-cog"></i>';
    document.getElementById('editModeIndicator').classList.add('active');
    showAdminControls();
  }
}

function loadServices() {
  let services = getServicesFromStorage();
  
  // If no services in storage, load defaults
  if (!services || services.length === 0) {
    services = getDefaultServices();
    saveServicesToStorage(services);
  }
  
  renderServices(services);
}

function getServicesFromStorage() {
  try {
    const encrypted = localStorage.getItem('techDasunServicesEncrypted');
    if (!encrypted) return null;
    
    const decrypted = simpleDecrypt(encrypted);
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error loading services:', error);
    return null;
  }
}

function saveServicesToStorage(services) {
  try {
    const jsonString = JSON.stringify(services);
    const encrypted = simpleEncrypt(jsonString);
    localStorage.setItem('techDasunServicesEncrypted', encrypted);
    
    // Also save login state
    if (isAdminLoggedIn) {
      localStorage.setItem('techDasunAdminLoggedIn', 'true');
    }
  } catch (error) {
    console.error('Error saving services:', error);
  }
}

function getDefaultServices() {
  return [
    {
      id: 1,
      name: "WhatsApp Bot Development",
      icon: "fas fa-robot",
      description: "Custom WhatsApp bot development with advanced features, AI integration, and multi-language support.",
      price: "5,000 LKR",
      color: "#00ffcc"
    },
    {
      id: 2,
      name: "Website Design",
      icon: "fas fa-code",
      description: "Modern responsive website design with animations, SEO optimization, and mobile compatibility.",
      price: "8,000 LKR",
      color: "#ffcc00"
    },
    {
      id: 3,
      name: "Tech Support",
      icon: "fas fa-headset",
      description: "24/7 technical support for software issues, troubleshooting, and system maintenance.",
      price: "2,500 LKR/month",
      color: "#ff3366"
    },
    {
      id: 4,
      name: "App Development",
      icon: "fas fa-mobile-alt",
      description: "Cross-platform mobile application development for Android and iOS with backend integration.",
      price: "15,000 LKR",
      color: "#3366ff"
    },
    {
      id: 5,
      name: "Data Recovery",
      icon: "fas fa-hdd",
      description: "Professional data recovery services for hard drives, SSDs, USB drives, and memory cards.",
      price: "3,500 LKR",
      color: "#33cc33"
    },
    {
      id: 6,
      name: "SEO Optimization",
      icon: "fas fa-chart-line",
      description: "Search Engine Optimization to improve your website ranking on Google and other search engines.",
      price: "6,000 LKR",
      color: "#00ffcc"
    }
  ];
}

function renderServices(services) {
  const serviceGrid = document.getElementById('serviceGrid');
  serviceGrid.innerHTML = '';
  
  services.forEach(service => {
    const serviceBox = document.createElement('div');
    serviceBox.className = 'service-box';
    serviceBox.style.borderColor = service.color;
    serviceBox.dataset.id = service.id;
    
    // Create contact button HTML
    const contactButtonHTML = `
      <button class="contact-btn" onclick="openWhatsApp('${service.name.replace(/'/g, "\\'")}')">
        <i class="fab fa-whatsapp"></i> Contact Us Owner
      </button>
    `;
    
    serviceBox.innerHTML = `
      <div class="service-icon">
        <i class="${service.icon}"></i>
      </div>
      <h3 class="service-title">${service.name}</h3>
      <p class="service-description">${service.description}</p>
      <div class="service-price">${service.price}</div>
      ${contactButtonHTML}
      ${isAdminLoggedIn ? `
        <div class="add-service-btn" onclick="editService(${service.id})">
          <i class="fas fa-edit"></i>
        </div>
        <div class="add-service-btn" style="top: 60px; background: rgba(255, 51, 102, 0.2);" onclick="deleteService(${service.id})">
          <i class="fas fa-trash"></i>
        </div>
      ` : ''}
    `;
    
    // For normal users, show service details on click (excluding the button click)
    if (!isAdminLoggedIn) {
      serviceBox.addEventListener('click', function(e) {
        // Don't trigger if the click is on the contact button
        if (!e.target.closest('.contact-btn')) {
          showServiceDetails(service);
        }
      });
    }
    
    serviceGrid.appendChild(serviceBox);
  });
}

function showServiceDetails(service) {
  const details = `
Service: ${service.name}
Price: ${service.price}
Description: ${service.description}

To purchase this service, please contact Tech With Dasun.
  `;
  alert(details);
}

function showAdminControls() {
  const serviceBoxes = document.querySelectorAll('.service-box');
  serviceBoxes.forEach(box => {
    const editBtn = box.querySelector('.add-service-btn');
    const deleteBtn = box.querySelector('.add-service-btn:nth-child(2)');
    if (editBtn) editBtn.style.opacity = '1';
    if (deleteBtn) deleteBtn.style.opacity = '1';
  });
}

function hideAdminControls() {
  const serviceBoxes = document.querySelectorAll('.service-box');
  serviceBoxes.forEach(box => {
    const editBtn = box.querySelector('.add-service-btn');
    const deleteBtn = box.querySelector('.add-service-btn:nth-child(2)');
    if (editBtn) editBtn.style.opacity = '0';
    if (deleteBtn) deleteBtn.style.opacity = '0';
  });
}

function saveService() {
  const name = document.getElementById('serviceName').value.trim();
  const icon = document.getElementById('serviceIcon').value.trim();
  const description = document.getElementById('serviceDescription').value.trim();
  const price = document.getElementById('servicePrice').value.trim();
  const color = document.getElementById('serviceColor').value;
  
  if (!name || !description || !price) {
    alert('Please fill in all required fields!');
    return;
  }
  
  let services = getServicesFromStorage() || [];
  const priceWithCurrency = price.includes('LKR') ? price : price + ' LKR';
  
  if (editServiceId) {
    // Update existing service
    const index = services.findIndex(s => s.id === editServiceId);
    if (index !== -1) {
      services[index] = {
        ...services[index],
        name,
        icon: icon || 'fas fa-cogs',
        description,
        price: priceWithCurrency,
        color
      };
    }
    editServiceId = null;
  } else {
    // Add new service
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const newService = {
      id: newId,
      name,
      icon: icon || 'fas fa-cogs',
      description,
      price: priceWithCurrency,
      color
    };
    
    services.push(newService);
  }
  
  saveServicesToStorage(services);
  renderServices(services);
  clearForm();
  
  const message = editServiceId ? 'Service updated successfully!' : 'Service added successfully!';
  alert(message);
  
  // Scroll to the updated/added service
  setTimeout(() => {
    const serviceGrid = document.getElementById('serviceGrid');
    serviceGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

function editService(id) {
  const services = getServicesFromStorage() || [];
  const service = services.find(s => s.id === id);
  
  if (!service) return;
  
  editServiceId = id;
  
  // Fill form with service data
  document.getElementById('serviceName').value = service.name;
  document.getElementById('serviceIcon').value = service.icon;
  document.getElementById('serviceDescription').value = service.description;
  document.getElementById('servicePrice').value = service.price.replace(' LKR', '');
  document.getElementById('serviceColor').value = service.color;
  
  // Scroll to form
  document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
  
  // Change button text
  const submitBtn = document.querySelector('#serviceForm button[type="submit"]');
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Service';
}

function deleteService(id) {
  if (!confirm('Are you sure you want to delete this service?')) return;
  
  let services = getServicesFromStorage() || [];
  services = services.filter(s => s.id !== id);
  
  saveServicesToStorage(services);
  renderServices(services);
  
  alert('Service deleted successfully!');
  
  // Clear form if editing this service
  if (editServiceId === id) {
    clearForm();
    editServiceId = null;
  }
}

function clearForm() {
  document.getElementById('serviceForm').reset();
  document.getElementById('serviceIcon').value = 'fas fa-robot';
  editServiceId = null;
  
  // Reset button text
  const submitBtn = document.querySelector('#serviceForm button[type="submit"]');
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Service';
}

function resetToDefault() {
  if (!confirm('This will reset all services to default. Are you sure?')) return;
  
  const defaultServices = getDefaultServices();
  saveServicesToStorage(defaultServices);
  renderServices(defaultServices);
  
  alert('Services reset to default successfully!');
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize matrix rain background
  createMatrixRain();
  
  // Regenerate matrix rain every 10 seconds
  setInterval(() => {
    const matrixRain = document.getElementById('matrixRain');
    matrixRain.innerHTML = '';
    createMatrixRain();
  }, 10000);
  
  if (document.getElementById('store').classList.contains('active')) {
    initializeStorePage();
  }
});

// Resize handler for background
window.addEventListener('resize', function() {
  const matrixRain = document.getElementById('matrixRain');
  matrixRain.innerHTML = '';
  createMatrixRain();
});
