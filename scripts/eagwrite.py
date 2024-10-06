class EagWrite:
    def __init__(self):
        self.charmap = charmap
        self.extra_x = 0
    def write(self, text='Insert Text', x=0, y=0, color='black', shadow_color='#383838', size=5, spacing=3):
        destroy_data = []
        only_square_data = []
        all_data = []
        self.extra_x = 0

        def write_letter(letter, x, y, color, size, shadow_color):
            letter_pixel_width = 0
            if letter != ' ':
                letter_data = str(self.charmap[letter])
                letter_data_lines = letter_data.strip().split('\n')
                for row_index, row in enumerate(letter_data_lines):
                    for col_index, char in enumerate(row):
                        if char == '#':
                            shadow = js.document.createElement('div')
                            shadow.style.width = f'{size}px'
                            shadow.style.height = f'{size}px'
                            shadow.style.backgroundColor = shadow_color
                            shadow.style.pointerEvents = 'none'
                            shadow.style.position = 'absolute'
                            shadow.style.left = f'{x + self.extra_x + col_index * size + size}px'  # Offset shadow to the right
                            shadow.style.top = f'{y + row_index * size + size}px'  # Offset shadow down
                            js.document.body.appendChild(shadow)

                            square = js.document.createElement('div')
                            square.style.width = f'{size}px'
                            square.style.height = f'{size}px'
                            square.style.backgroundColor = color
                            square.style.pointerEvents = 'none'
                            square.style.position = 'absolute'
                            square.style.left = f'{x + self.extra_x + col_index * size}px'
                            square.style.top = f'{y + row_index * size}px'
                            js.document.body.appendChild(square)

                            destroy_data.append(square)
                            destroy_data.append(shadow)

                            only_square_data.append(square)
                    letter_pixel_width = max(letter_pixel_width, len(row) * size)

                self.extra_x += letter_pixel_width + spacing
            else:
                self.extra_x += size * spacing

        for letter in text:
            write_letter(letter, x, y, color, size, shadow_color)
        
        all_data.append(destroy_data)
        all_data.append(only_square_data)

        return all_data










    def destroy(_, write_data):
        broadcast('(temporarily) Destroying text...')
        for sqaure in write_data[0]:
            js.document.body.removeChild(sqaure)
    def change_color(_, write_data, color):
        for square in write_data[1]:
            square.style.backgroundColor = color
    