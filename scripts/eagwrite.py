from pyodide.ffi import create_proxy
import random

class EagWrite:
    def __init__(self):
        self.charmap = charmap
        self.extra_x = 0
        self.glitch_intervals = []

    def write(self, text='Insert Text', x=0, y=0, color='black', shadow_color='#383838', size=5, spacing=3):
        destroy_data = []
        only_square_data = []
        all_data = []
        self.extra_x = 0
        self.text = text
        bold = 0
        italic_offset = 0
        underline = False
        strikethrough = False
        glitch = False

        # Text Formatting Options and Color Codes
        if '&1' in self.text:
            self.text = self.text.replace('&1', '')
            color = 'rgb(0, 0, 169)'  # Dark Blue
        if '&2' in self.text:
            self.text = self.text.replace('&2', '')
            color = 'rgb(0, 169, 0)'  # Dark Green
        if '&3' in self.text:
            self.text = self.text.replace('&3', '')
            color = 'rgb(0, 169, 169)'  # Dark Aqua
        if '&4' in self.text:
            self.text = self.text.replace('&4', '')
            color = 'rgb(169, 0, 0)'  # Dark Red
        if '&5' in self.text:
            self.text = self.text.replace('&5', '')
            color = 'rgb(169, 0, 169)'  # Dark Purple
        if '&6' in self.text:
            self.text = self.text.replace('&6', '')
            color = 'rgb(255, 169, 0)'  # Gold
        if '&7' in self.text:
            self.text = self.text.replace('&7', '')
            color = 'rgb(169, 169, 169)'  # Gray
        if '&8' in self.text:
            self.text = self.text.replace('&8', '')
            color = 'rgb(84, 84, 84)'  # Dark Gray
        if '&9' in self.text:
            self.text = self.text.replace('&9', '')
            color = 'rgb(84, 84, 255)'  # Blue
        if '&a' in self.text:
            self.text = self.text.replace('&a', '')
            color = 'rgb(84, 255, 84)'  # Green
        if '&b' in self.text:
            self.text = self.text.replace('&b', '')
            color = 'rgb(84, 255, 255)'  # Aqua
        if '&c' in self.text:
            self.text = self.text.replace('&c', '')
            color = 'rgb(255, 84, 84)'  # Red
        if '&d' in self.text:
            self.text = self.text.replace('&d', '')
            color = 'rgb(255, 84, 255)'  # Light Purple
        if '&e' in self.text:
            self.text = self.text.replace('&e', '')
            color = 'rgb(255, 255, 84)'  # Yellow
        if '&f' in self.text:
            self.text = self.text.replace('&f', '')
            color = 'rgb(255, 255, 255)'  # White

        if '&k' in self.text:
            self.text = self.text.replace('&k', '')
            glitch = True
        if '&l' in self.text:
            self.text = self.text.replace('&l', '')
            bold += size / 3
        if '&o' in self.text:
            self.text = self.text.replace('&o', '')
            italic_offset = size / 5
        if '&n' in self.text:
            self.text = self.text.replace('&n', '')
            underline = True
        if '&m' in self.text:
            self.text = self.text.replace('&m', '')
            strikethrough = True

        total_width = 0
        max_height = 0

        for letter in self.text:
            if letter != ' ':
                letter_data = str(self.charmap[letter])
                letter_data_lines = letter_data.strip().split('\n')
                letter_pixel_width = max(len(line) for line in letter_data_lines) * size
                total_width += letter_pixel_width + spacing
                max_height = max(max_height, len(letter_data_lines) * size)
            else:
                total_width += size * spacing

        def write_letter(letter, x, y, color, size, shadow_color):
            letter_pixel_width = 0
            if letter != ' ':
                letter_data = str(self.charmap[letter])
                letter_data_lines = letter_data.strip().split('\n')
                for row_index, row in enumerate(letter_data_lines):
                    for col_index, char in enumerate(row):
                        if char == '#':
                            y_offset = 0

                            shadow = js.document.createElement('div')
                            shadow.style.width = f'{size + bold}px'
                            shadow.style.height = f'{size + bold}px'
                            shadow.style.backgroundColor = shadow_color
                            shadow.style.pointerEvents = 'none'
                            shadow.style.position = 'absolute'
                            shadow.style.left = f'{x + self.extra_x + col_index * size + size - italic_offset * row_index}px'
                            shadow.style.top = f'{y + row_index * size + size + y_offset}px'
                            js.document.body.appendChild(shadow)

                            square = js.document.createElement('div')
                            square.style.width = f'{size + bold}px'
                            square.style.height = f'{size + bold}px'
                            square.style.backgroundColor = color
                            square.style.pointerEvents = 'none'
                            square.style.position = 'absolute'
                            square.style.left = f'{x + self.extra_x + col_index * size - italic_offset * row_index}px'
                            square.style.top = f'{y + row_index * size + y_offset}px'
                            js.document.body.appendChild(square)

                            destroy_data.append(square)
                            destroy_data.append(shadow)

                            only_square_data.append((square, shadow))

                            # Add animation effect if glitch is enabled
                            if glitch:
                                def apply_glitch(square=square, shadow=shadow, row_index=row_index):
                                    random_y_offset = random.randint(-size, size)
                                    square.style.top = f'{y + row_index * size + random_y_offset}px'
                                    shadow.style.top = f'{y + row_index * size + size + random_y_offset}px'

                                glitch_proxy = create_proxy(apply_glitch)
                                interval = js.setInterval(glitch_proxy, 0)
                                self.glitch_intervals.append((interval, glitch_proxy))

                    letter_pixel_width = max(letter_pixel_width, len(row) * size)

                self.extra_x += letter_pixel_width + spacing
            else:
                self.extra_x += size * spacing

        for letter in self.text:
            write_letter(letter, x, y, color, size, shadow_color)

        if underline:
            underline_div = js.document.createElement('div')
            underline_div.style.width = f'{total_width - spacing}px'
            underline_div.style.height = f'{size / 2}px'
            underline_div.style.backgroundColor = color
            underline_div.style.pointerEvents = 'none'
            underline_div.style.position = 'absolute'
            underline_div.style.left = f'{x}px'
            underline_div.style.top = f'{y + max_height + size / 3}px'
            js.document.body.appendChild(underline_div)

            destroy_data.append(underline_div)

        if strikethrough:
            strikethrough_div = js.document.createElement('div')
            strikethrough_div.style.width = f'{total_width - spacing}px'
            strikethrough_div.style.height = f'{size / 3}px'
            strikethrough_div.style.backgroundColor = color
            strikethrough_div.style.pointerEvents = 'none'
            strikethrough_div.style.position = 'absolute'
            strikethrough_div.style.left = f'{x}px'
            strikethrough_div.style.top = f'{y + max_height / 2}px'
            js.document.body.appendChild(strikethrough_div)

            destroy_data.append(strikethrough_div)

        all_data.append(destroy_data)
        all_data.append(only_square_data)

        return all_data

    def destroy(self, write_data):
        for square in write_data[0]:
            js.document.body.removeChild(square)
        # Stop all glitch intervals and release proxy objects
        for interval, proxy in self.glitch_intervals:
            js.clearInterval(interval)
            proxy.destroy()
        self.glitch_intervals.clear()

    def change_color(self, write_data, color):
        for square, _ in write_data[1]:
            square.style.backgroundColor = color
