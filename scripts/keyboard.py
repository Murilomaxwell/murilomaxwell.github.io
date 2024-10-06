class keyboard:
    def __init__(self):
        self.pressed_keys = set()
        
        js.window.addEventListener('keydown', self._on_key_down)
        js.window.addEventListener('keyup', self._on_key_up)
    
    def _on_key_down(self, event):
        self.pressed_keys.add(event.key)
    
    def _on_key_up(self, event):
        self.pressed_keys.discard(event.key)
    
    def is_key_pressed(self, key):
        return key in self.pressed_keys
    
    def get_pressed_keys(self):
        return list(self.pressed_keys)