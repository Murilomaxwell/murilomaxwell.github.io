class EagWrite:
    def __init__(self):
        self.charmap = charmap
        self.extra_x = 0

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

        if '&1' in self.text:
            self.text = self.text.replace('&1', '')
            color = 'rgb(0, 0, 169)'
        if '&2' in self.text:
            self.text = self.text.replace('&2', '')
            color = 'rgb(1, 170, 1)'
        if '&3' in self.text:
            self.text = self.text.replace('&3', '')
            color = 'rgb(1, 170, 170)'
        if '&4' in self.text:
            self.text = self.text.replace('&4', '')
            color = 'rgb(170, 1, 1)'
        if '&5' in self.text:
            self.text = self.text.replace('&5', '')
            color = 'rgb(170, 1, 170)'
        if '&6' in self.text:
            self.text = self.text.replace('&6', '')
            color = 'rgb(255, 170, 1)'
        if '&7' in self.text:
            self.text = self.text.replace('&7', '')
            color = 'rgb(169, 170, 170)'
        if '&8' in self.text:
            self.text = self.text.replace('&8', '')
            color = 'rgb(86, 86, 86)'
        if '&9' in self.text:
            self.text = self.text.replace('&9', '')
            color = 'rgb(86, 86, 255)'

        if '&a' in self.text:
            self.text = self.text.replace('&a', '')
            color = 'rgb(85, 254, 85)'
        if '&b' in self.text:
            self.text = self.text.replace('&b', '')
            color = 'rgb(85, 254, 254)'
        if '&c' in self.text:
            self.text = self.text.replace('&c', '')
            color = 'rgb(254, 85, 85)'
        if '&d' in self.text:
            self.text = self.text.replace('&d', '')
            color = 'rgb(254, 85, 254)'
        if '&e' in self.text:
            self.text = self.text.replace('&e', '')
            color = 'rgb(254, 254, 85)'
        if '&f' in self.text:
            self.text = self.text.replace('&f', '')
            color = 'rgb(254, 254, 254)'
        if '&k' in self.text:
            self.text = self.text.replace('&k', '')
            glitch = True
            # not completed
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
        if '&r' in self.text:
            self.text = self.text.replace('&r', '')
            color = 'rgb(254, 254, 254)'
            # not done

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
                            if glitch:
                                y_offset = random.randint(-size, size)

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

                            only_square_data.append(square)
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

    def destroy(_, write_data):
        broadcast('(temporarily) Destroying text...')
        for square in write_data[0]:
            js.document.body.removeChild(square)

    def change_color(_, write_data, color):
        for square in write_data[1]:
            square.style.backgroundColor = color
