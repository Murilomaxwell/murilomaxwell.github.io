function broadcast(text) {
    let now = new Date();
    console.log(`[EAGLERCRAFT] (${now}): ${text}`);
}

broadcast('Eaglercraft 1.13 client started.');

let chosen_skin = 'Default Steve';
let eagler_words = ['Eagler', 'Darv', 'Yigg', 'Deev', 'Vigg', 'Yeer', 'Yeeish'];
let USERNAME = eagler_words[Math.floor(Math.random() * eagler_words.length)] + 
               eagler_words[Math.floor(Math.random() * eagler_words.length)] + 
               (Math.floor(Math.random() * 9980) + 20);
broadcast(`Username: ${USERNAME}`);

function launchEaglercraft() {
    document.body.innerHTML = '';
    

    let windowW = window.innerWidth;
    let windowH = window.innerHeight;

    let is_agreement_loaded = false;

    window.addEventListener('error', (event) => {
        console.error(`Global Error: ${event.message}`);
    });

    class AudioManager {
        constructor() {
            this.playing_audio = [];
        }

        // Play audio from a given URL
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

        // Stop a specific audio
        stop(audio_data) {
            if (audio_data) {
                audio_data.pause();
                audio_data.currentTime = 0;
                this.playing_audio = this.playing_audio.filter(sound => sound !== audio_data);
            }
        }

        // Toggle looping for a specific audio
        toggle_loop(audio_data) {
            if (audio_data) {
                audio_data.loop = !audio_data.loop; // Toggle loop state
            }
        }

        // Adjust the volume of a specific audio
        adjust_volume(volume, audio_data) {
            if (audio_data) {
                audio_data.volume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
            }
        }

        // Stop all currently playing audio
        stop_all_sound() {
            this.playing_audio.forEach(sound => this.stop(sound));
        }
    }

    let audio = new AudioManager();
    audio.play('assets/sounds/music/menu/menu1.ogg');

    let event_proxies = [];
    let start_buttons = [];
    let start_text = [];

    function create_button(text = 'Button', size = 2, onclick = null, x = 100, y = 100, text_tune = 70) {
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
        button.className = 'gui-widgets-button';
        button.style.transform = `scale(${size})`;
        button.style.position = 'absolute';
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        button.addEventListener('click', click_proxy);
        button.addEventListener('mouseenter', hover_proxy);
        button.addEventListener('mouseleave', leave_proxy);
        document.body.appendChild(button);

        let button_text = eagwrite.write(text, x + text_tune, text_y, 'white', '#383838', size + 0.5, 3, 1); 



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
        document.body.style.backgroundImage = "url('assets/eagler/editprofile_bg.png')";

        let text1 = eagwrite.write('&l Information', windowW / 2 - 140, 200, 'lime', '#383838', 5);
        let text2 = eagwrite.write('&o This software is NOT pirated', windowW / 2 - 300, 300, 'red', '#383838', 5);
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

        let agreement_button = create_button('Next', 2, agreement_profile_page, windowW / 2 - 100, windowH - 300);
        start_buttons.push(agreement_button);
    }

    function edit_profile_page() {
        document.body.style.backgroundImage = "url('assets/eagler/editprofile_bg.png')";
        let edit_profile_text = eagwrite.write('Edit Profile', windowW / 2 - 140, 0, 'black', '#383838', 5);
        start_text.push(edit_profile_text);

        let done_button = create_button('Done', 2, titlescreen.open_titlescreen, windowW / 2 - 100, windowH - 200);
        let import_skin_button = create_button('Import Skin', 2, null, windowW / 2 - 100, windowH - 300, 40);

        start_buttons.push(done_button);
        start_buttons.push(import_skin_button);

        let editprofile_frame = document.createElement('div');
        editprofile_frame.style.position = 'absolute';
        editprofile_frame.style.backgroundColor = 'rgb(0, 0, 21)';
        editprofile_frame.style.border = '2px solid yellow';
        editprofile_frame.style.width = '250px';
        editprofile_frame.style.height = '400px';
        editprofile_frame.style.top = '200px';
        editprofile_frame.style.left = `${windowW / 2 - 150}px`;
        document.body.appendChild(editprofile_frame);

        eagwrite.write('Choose a skin', 1150, windowW / 2 - 550, 'lime', { size: 3 });
        eagwrite.write('Enter a username', 1130, windowW / 2 - 750, 'lime', { size: 3 });

        let dropdown = document.createElement('button');
        dropdown.className = 'eagler-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '450px';
        dropdown.style.left = `${windowW / 2 + 150}px`;
        document.body.appendChild(dropdown);

        eagwrite.write(chosen_skin, 1140, windowW / 2 - 505, 'yellow', { size: 3 });

        let input = document.createElement('button');
        input.className = 'eagler-input';
        input.style.position = 'absolute';
        input.style.top = '250px';
        input.style.left = `${windowW / 2 + 150}px`;
        document.body.appendChild(input);

        eagwrite.write(USERNAME, 1130, windowW / 2 - 700, 'yellow', { size: 3 });
    }

    class Titlescreen {
        clear_start() {
            start_buttons.forEach(destroy_button);
            start_buttons = [];
            start_text.forEach(eagwrite.destroy);
            start_text = [];
        }

        open_titlescreen() {
            this.clear_start();
        }
    }

    let titlescreen = new Titlescreen();

    load_agreement();
}