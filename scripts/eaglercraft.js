function broadcast(text) {
    let now = new Date();
    console.log(`[EAGLERCRAFT] (${now}): ${text}`);
}

broadcast('Eaglercraft 1.20 client started.');

let chosen_skin = 'Default Steve';
let eagler_words = ['Eagler', 'Darv', 'Yigg', 'Deev', 'Vigg', 'Yeer'];
let USERNAME = eagler_words[Math.floor(Math.random() * eagler_words.length)] + 
               eagler_words[Math.floor(Math.random() * eagler_words.length)] + 
               (Math.floor(Math.random() * 79) + 20);
broadcast(`Username: ${USERNAME}`);

const panoramaImages = [
    'assets/gui/title/background/panorama_0.png',
    'assets/gui/title/background/panorama_1.png',
    'assets/gui/title/background/panorama_2.png',
    'assets/gui/title/background/panorama_3.png',
    'assets/gui/title/background/panorama_4.png',
    'assets/gui/title/background/panorama_5.png'
];

const splashTexts = [
    'eaglercraft 1.20',
    'woohooo!',
    'You Eagler!',
    'You Vigg!',
    'You Darviggler!',
    'You Raven!',
    'Play it Now!',
]

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function launchEaglercraft() {
    document.body.innerHTML = '';
    

    let windowW = window.innerWidth;
    let windowH = window.innerHeight;


    let back = 0;
    if (windowW < 1920) {
       back = windowH - 250
    }

    console.log(windowW, windowH)

    let is_agreement_loaded = false;

    window.addEventListener('error', (event) => {
        console.error(`Global Error: ${event.message}`);
    });

    class AudioManager {
        constructor() {
            this.playing_audio = [];
        }

        play(sound_url) {
            try {
                const sound = new Audio(sound_url);
                sound.loop = false;
                sound.play();
                this.playing_audio.push(sound);
                return sound;
            } catch (e) {
                console.error(`Error playing sound: ${e}`);
            }
        }

        stop(audio_data) {
            if (audio_data) {
                audio_data.pause();
                audio_data.currentTime = 0;
                this.playing_audio = this.playing_audio.filter(sound => sound !== audio_data);
            }
        }

        toggle_loop(audio_data) {
            if (audio_data) {
                audio_data.loop = !audio_data.loop;
            }
        }

        adjust_volume(volume, audio_data) {
            if (audio_data) {
                audio_data.volume = Math.min(Math.max(volume, 0), 1); 
            }
        }

        stop_all_sound() {
            this.playing_audio.forEach(sound => this.stop(sound));
        }
    }

    let audio = new AudioManager();
    audio.play('assets/sounds/music/menu/menu1.ogg');

    let event_proxies = [];

    function create_button(text = 'Button', size = 2, onclick = null, x = 100, y = 100, text_tune = 70, state='gui-widgets-button', animation='none') {
        let button_text; 
        y += 20;
        let text_x = x + 50;
        let text_y = y - 5;
    
        console.log(`Creating button with text '${text}' at position (${x}, ${y})`);
    
        let click_proxy = (event) => {
            console.log("Button clicked!");
            audio.play('assets/sounds/random/click.ogg');
            if (onclick) onclick(event);
        };
    
        let hover_proxy = () => {
            eagwrite.change_color(button_text, '#feffa0');
        };
    
        let leave_proxy = () => {
            eagwrite.change_color(button_text, 'white');
        };
    
        let button = document.createElement('button');
        button.className = state;
        button.style.transform = `scale(${size})`;
        button.style.position = 'absolute';
        button.style.animation = animation;
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.addEventListener('click', click_proxy);
        button.addEventListener('mouseenter', hover_proxy);
        button.addEventListener('mouseleave', leave_proxy);
        document.body.appendChild(button);
    
        if (state == 'gui-widgets-button') {
            button_text = eagwrite.write(text, x + text_tune, text_y, 'white', '#383838', size + 0.5, 3, 1, animation); 
        } else {
            button_text = eagwrite.write(text, x + text_tune, text_y, 'rgb(121, 121, 121)', null, size + 0.5, 3, 1, animation);
        }
    
        function destroy() {
            if (button && button.parentNode) {
                console.log("Removing button element from DOM.");
                document.body.removeChild(button);
            } else {
                console.warn("Button element not found in DOM during removal.");
            }
            eagwrite.destroy(button_text);
        }
    
        return [button_text, button, destroy];
    }

    function destroy_button(button_data) {
        try {
            console.log("Destroying button.");
            eagwrite.destroy(button_data[0]);
            button_data[1].remove();
            button_data[2]();
        } catch (e) {
            console.error(`Error destroying button: ${e}`);
        }
    }

    function load_agreement() {
        if (is_agreement_loaded) return;
        is_agreement_loaded = true;
        console.log("Loading agreement screen.");
        document.body.style.backgroundImage = `url('assets/eagler/bg/${Math.floor(Math.random() * 7) + 1}.png')`;
        let text3 = eagwrite.write('&n This is just a RECREATION of Minecraft', windowW / 2 - 400, 400, 'yellow', '#383838', 5);
        let text4 = eagwrite.write('Any DMCA request toward this client is unnecessary', windowW / 2 - 700, 500, 'orange', '#383838', 5);


        function agreement_profile_page() {
            console.log("Moving to edit profile page.");
            eagwrite.destroy(text1);
            eagwrite.destroy(text2);
            eagwrite.destroy(text3);
            eagwrite.destroy(text4);
            destroy_button(agreement_button);
            edit_profile_page();
        }

        let agreement_button = create_button('Agree', 2, titlescreen.open_titlescreen.bind(titlescreen), windowW / 2 - 100, windowH - 300);
    }
        input.focus();
    }

    class Titlescreen {
        clear_start(_) {
            console.log(USERNAME)
            document.body.innerHTML = ''
        }

        open_titlescreen() {
            let splashText = getRandomItem(splashTexts)
            this.clear_start();
            this.panorama();

            const minecraft_photo = document.createElement('img');
            minecraft_photo.src = 'assets/gui/title/minecraft.png';
            minecraft_photo.style.position = 'absolute';
            minecraft_photo.style.width = '500px';
            minecraft_photo.style.left = '50%';
            minecraft_photo.style.top = '100px';
            minecraft_photo.style.animation = 'fadeIn 2s forwards';
            minecraft_photo.style.transform = 'translate(-50%, -50%)'; 
            document.body.appendChild(minecraft_photo); 

            const java_photo = document.createElement('img');
            java_photo.src = 'assets/gui/title/edition.png';
            java_photo.style.position = 'absolute';
            java_photo.style.width = '250px';
            java_photo.style.left = '50%';
            java_photo.style.top = '140px';
            java_photo.style.animation = 'fadeIn 2s forwards';
            java_photo.style.transform = 'translate(-40%, -60%)';
            document.body.append(java_photo)

            eagwrite.expandContract(eagwrite.write(splashText, x=windowW/2, y=170, 'rgb(255, 255, 84)', '#383838', 3, 3, 1, 'none', -30), 1500, 'ease-in-out')

        
            eagwrite.write('Minecraft 1.20.1', 0, windowH-50, 'white', '#383838', 3, 3, 1, 'fadeIn 2s forwards');
            eagwrite.write('::RECREATION::', windowW-600, windowH-50, 'white', '#383838', 3);
            create_button('Singleplayer', 2, null, windowW/2-100, windowH/2-100, 20, 'gui-widgets-button', 'fadeIn 2s forwards');
            create_button('Multiplayer', 2, null, windowW/2-100, windowH/2-50, 30, 'gui-widgets-button', 'fadeIn 2s forwards');
            create_button('Mods', 2, null, windowW/2-100, windowH/2-50, 40, 'gui-widgets-button-disabled', 'fadeIn 2s forwards');
        }

        panorama() {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            document.body.style.margin = '0';
            document.body.style.overflow = 'hidden';

            const textureLoader = new THREE.TextureLoader();

            const materials = [
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(panoramaImages[2]),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(panoramaImages[0]),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(panoramaImages[4]),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(panoramaImages[5]),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(panoramaImages[1]),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(panoramaImages[3]),
                    side: THREE.BackSide
                })
            ];

            const sphereGeometry = new THREE.BoxGeometry(500, 500, 500);
            const sphere = new THREE.Mesh(sphereGeometry, materials);
            scene.add(sphere);

            camera.position.set(0, 0, 0.1);

            const rotationSpeed = 0.001;

            function animate() {
                requestAnimationFrame(animate);
                
                sphere.rotation.y += rotationSpeed;  

                renderer.render(scene, camera);
            }

            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
    }

    let titlescreen = new Titlescreen();

    load_agreement();
}

    
