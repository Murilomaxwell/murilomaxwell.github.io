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
                            shadow = js.document.createElement('div')
                            shadow.style.width = f'{size + bold}px'
                            shadow.style.height = f'{size + bold}px'
                            shadow.style.backgroundColor = shadow_color
                            shadow.style.pointerEvents = 'none'
                            shadow.style.position = 'absolute'
                            shadow.style.left = f'{x + self.extra_x + col_index * size + size - italic_offset * row_index}px'
                            shadow.style.top = f'{y + row_index * size + size}px'
                            js.document.body.appendChild(shadow)

                            square = js.document.createElement('div')
                            square.style.width = f'{size + bold}px'
                            square.style.height = f'{size + bold}px'
                            square.style.backgroundColor = color
                            square.style.pointerEvents = 'none'
                            square.style.position = 'absolute'
                            square.style.left = f'{x + self.extra_x + col_index * size - italic_offset * row_index}px'
                            square.style.top = f'{y + row_index * size}px'
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
