js.document.body.innerHTML = ''
js.document.title = 'Eaglercraft 1.13'

sounds = dict(literal_eval(sounds))

DEBUGGING = True
if 'debugging=true' in dev_file:
    DEBUGGING = True


def broadcast(text):
    if DEBUGGING:
        now = datetime.datetime.now()
        print(f'[EAGLERCRAFT] ({now}): {text}')

broadcast('Eaglercraft 1.13 client started.')

eagler_words = ['Eagler', 'Darv', 'Yigg', 'Deev', 'Vigg', 'Yeer', 'Yeeish']
USERNAME = random.choice(eagler_words) + random.choice(eagler_words) + str(random.randint(20, 9999))
broadcast(f'Username: {USERNAME}')

eagwrite = EagWrite()

windowW = int(windowW)
windowH = int(windowH)

is_agreement_loaded = False

js.window.addEventListener('error', lambda event: js.console.error(f"Global Error: {event.message}"))

class AudioManager:
    def __init__(self):
        self.playing_audio = []

    def play(self, sound_data_base64):
        sound_url = f"data:audio/ogg;base64,{sound_data_base64}"
        try:
            self.sound = js.Audio.new(sound_url)
            self.sound.loop = False
            self.sound.play()
        except js.JsException as e:
            js.console.error(f"Error playing sound: {e}")
        self.playing_audio.append(self.sound)
        return self.sound

    def stop(self, audio_data):
        if audio_data is not None:
            audio_data.pause()
            audio_data.currentTime = 0
        self.playing_audio.remove(self.sound)

    def toggle_loop(self, audio_data):
        if audio_data is not None:
            audio_data.loop = True

    def adjust_volume(self, volume, audio_data):
        if audio_data is not None:
            audio_data.volume = volume

    def stop_all_sound(self):
        for sound in self.playing_audio:
            self.stop(sound)

audio = AudioManager()

audio.play(sounds['menu1'])

is_agreement_loaded = False

event_proxies = []
start_buttons = []
start_text = []

def create_button(text='Button', size=2, onclick=None, x=100, y=100, text_tune=70):
    y += 20
    text_x = x + 50  # Adjust for general centering of text inside button
    text_y = y - 5

    js.console.log(f"Creating button with text '{text}' at position ({x}, {y})")

    def click(event):
        js.console.log("Button clicked!")
        if hasattr(audio, 'playing') and audio.playing:
            audio.stop()
        audio.play(sounds['click'])
        if onclick is not None:
            onclick(event)

    def hover(event):
        nonlocal button_text
        eagwrite.change_color(button_text, '#feffa0')

    def leave(event):
        nonlocal button_text
        eagwrite.change_color(button_text, 'white')

    click_proxy = create_once_callable(click)

    hover_proxy = create_proxy(hover)
    leave_proxy = create_proxy(leave)
    event_proxies.extend([click_proxy, hover_proxy, leave_proxy])

    button = js.document.createElement('button')
    button.className = 'gui-widgets-button'
    button.style.transform = f'scale({size})'
    button.style.position = 'absolute'
    button.style.left = f'{x}px'
    button.style.top = f'{y}px'
    button.addEventListener('click', click_proxy)
    button.addEventListener('mouseenter', hover_proxy)
    button.addEventListener('mouseleave', leave_proxy)
    js.document.body.appendChild(button)

    # Adjust text centering inside the button
    button_text = eagwrite.write(text, x + text_tune, text_y, 'white', size=size + 0.2)

    def destroy():
        if button and button.parentNode:
            js.console.log("Removing button element from DOM.")
            js.document.body.removeChild(button)
        else:
            js.console.warn("Button element not found in DOM during removal.")
        
        eagwrite.destroy(button_text)
        
        click_proxy.destroy()
        hover_proxy.destroy()
        leave_proxy.destroy()

        event_proxies.remove(click_proxy)
        event_proxies.remove(hover_proxy)
        event_proxies.remove(leave_proxy)

    return [button_text, button, destroy]

def destroy_button(button_data):
    try:
        js.console.log("Destroying button.")
        eagwrite.destroy(button_data[0])
        
        if button_data[1].parentNode:
            button_data[1].remove()
        else:
            js.console.warn("Button element not found in DOM during removal.")

        button_data[2]()
    except Exception as e:
        js.console.error(f"Error destroying button: {e}")

def load_agreement():
    global is_agreement_loaded
    if is_agreement_loaded:
        return
    is_agreement_loaded = True
    js.console.log("Loading agreement screen.")
    js.document.body.style.backgroundImage = "url('assets/eagler/editprofile_bg.png')"
    text1 = eagwrite.write('&l Information', windowW / 2 - 140, 200, 'lime', shadow_color='#383838', size=5) 
    text2 = eagwrite.write('&o This software is NOT pirated', windowW / 2 - 300, 300, 'red', shadow_color='#383838', size=5) 
    text3 = eagwrite.write('&n This is just a RECREATION of Minecraft', windowW / 2 - 400, 400, 'yellow', shadow_color='#383838', size=5) 
    text4 = eagwrite.write('Any DMCA request toward this client is unnecessary', windowW / 2 - 700, 500, 'orange', shadow_color='#383838', size=5)

    def agreement_profile_page(_):
        js.console.log("Moving to edit profile page.")
        eagwrite.destroy(text1)
        eagwrite.destroy(text2)
        eagwrite.destroy(text3)
        eagwrite.destroy(text4)
        destroy_button(agreement_button)
        edit_profile_page()

    agreement_button = create_button('Next', x=windowW / 2 - 100, y=windowH - 300, onclick=agreement_profile_page)
    start_buttons.append(agreement_button)

def edit_profile_page(_=None):
    js.document.body.style.backgroundImage = "url('assets/eagler/editprofile_bg.png')"
    edit_profile_text = eagwrite.write(text='Edit Profile', x=windowW / 2 - 140, y=0, color='black', size=5, shadow_color='#383838')

    start_text.append(edit_profile_text)

    done_button = create_button('Done', x=windowW / 2 - 100, y=windowH - 200, onclick=titlescreen.open_titlescreen)
    
    import_skin_button = create_button('Import Skin', x=windowW / 2 - 100, y=windowH - 300, text_tune=40)

    start_buttons.append(done_button)
    start_buttons.append(import_skin_button)

    editprofile_frame = js.document.createElement('div')
    editprofile_frame.style.position = 'absolute'
    editprofile_frame.style.backgroundColor = 'rgb(0, 0, 21)'
    editprofile_frame.style.border = '2px solid yellow'
    editprofile_frame.style.width = '250px'
    editprofile_frame.style.height = '400px'
    editprofile_frame.style.top = '200px'
    editprofile_frame.style.left = f'{windowW/2-150}px'
    js.document.body.appendChild(editprofile_frame)

    dropdown = js.document.createElement('button')
    dropdown.style.position = 'absolute'
    dropdown.className = 'eagler-dropdown'
    dropdown.style.top = '350px'
    dropdown.style.left = f'{windowW/2+150}px'
    js.document.body.appendChild(dropdown)

load_agreement()

class Titlescreen:
    def __init__(self):
        pass

    def clear_start(self):
        for a in start_buttons:
            destroy_button(a)
        start_buttons.clear()

        for b in start_text:
            eagwrite.destroy(b)
        start_text.clear()

    def open_titlescreen(self, _):
        self.clear_start()

global titlescreen
titlescreen = Titlescreen()