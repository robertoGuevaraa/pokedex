let darkMode = localStorage.getItem('dark_mode');
const themeSwitch = document.getElementById('theme-switch');

const enableDarkMode = () =>{
	document.body.classList.add('dark_mode');
	localStorage.setItem('dark_mode', 'active');
}

const disableDarkMode = () =>{
	document.body.classList.remove('dark_mode');
	localStorage.setItem('dark_mode', null);
}

if(darkMode === 'active'){
	enableDarkMode();
}

themeSwitch.addEventListener('click', () => {
	darkMode = localStorage.getItem('dark_mode');
	darkMode !== "active" ? enableDarkMode() : disableDarkMode();
})