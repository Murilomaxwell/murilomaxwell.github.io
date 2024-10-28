class EagWrite {
    constructor(charmap) {
        this.charmap = charmap;
        this.extra_x = 0;
        this.glitch_intervals = [];
        this.square_adjust = 1;  
        this.current_write_data = null; 
    }

    write(text = 'Insert Text', x = 0, y = 0, color = 'black', shadow_color = '#383838', size = 5, spacing = 3, square_adjust = 1, animation='none', rotation = 0) {
        // Create a container div for the entire text
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        container.style.transform = `rotate(${rotation}deg)`;
        container.style.transformOrigin = 'left top';
        document.body.appendChild(container);

        this.square_adjust = square_adjust; 
        let destroy_data = [container];
        let only_square_data = [];
        let all_data = [];
        this.extra_x = 0;
        this.text = text;
        let bold = 0;
        let italic_offset = 0;
        let underline = false;
        let strikethrough = false;
        let glitch = false;
    
        const colorCodes = {
            '&1': 'rgb(0, 0, 169)',
            '&2': 'rgb(0, 169, 0)',
            '&3': 'rgb(0, 169, 169)',
            '&4': 'rgb(169, 0, 0)',
            '&5': 'rgb(169, 0, 169)',
            '&6': 'rgb(255, 169, 0)',
            '&7': 'rgb(169, 169, 169)',
            '&8': 'rgb(84, 84, 84)',
            '&9': 'rgb(84, 84, 255)',
            '&a': 'rgb(84, 255, 84)',
            '&b': 'rgb(84, 255, 255)',
            '&c': 'rgb(255, 84, 84)',
            '&d': 'rgb(255, 84, 255)',
            '&e': 'rgb(255, 255, 84)',
            '&f': 'rgb(255, 255, 255)'
        };
    
        Object.keys(colorCodes).forEach(key => {
            if (this.text.includes(key)) {
                this.text = this.text.replace(key, '');
                color = colorCodes[key];
            }
        });
    
        if (this.text.includes('&k')) {
            this.text = this.text.replace('&k', '');
            glitch = true;
        }
        if (this.text.includes('&l')) {
            this.text = this.text.replace('&l', '');
            bold += size / 3;
        }
        if (this.text.includes('&o')) {
            this.text = this.text.replace('&o', '');
            italic_offset = size / 5;
        }
        if (this.text.includes('&n')) {
            this.text = this.text.replace('&n', '');
            underline = true;
        }
        if (this.text.includes('&m')) {
            this.text = this.text.replace('&m', '');
            strikethrough = true;
        }
    
        let total_width = 0;
        let max_height = 0;
    
        for (let letter of this.text) {
            if (letter !== ' ') {
                if (this.charmap[letter]) {
                    let letter_data = this.charmap[letter].trim().split('\n');
                    let letter_pixel_width = Math.max(...letter_data.map(line => line.length)) * size;
                    total_width += letter_pixel_width + spacing;
                    max_height = Math.max(max_height, letter_data.length * size);
                } else {
                    console.warn(`Character "${letter}" not found in charmap.`);
                }
            } else {
                total_width += size * spacing;
            }
        }
    
        const write_letter = (letter, x, y, color, size, shadow_color) => {
            let letter_pixel_width = 0;
            if (letter !== ' ') {
                if (this.charmap[letter]) {
                    let letter_data = this.charmap[letter].trim().split('\n');
                    letter_data.forEach((row, row_index) => {
                        row.split('').forEach((char, col_index) => {
                            if (char === '#') {
                                let y_offset = 0;
    
                                let shadow = document.createElement('div');
                                shadow.style.width = `${size * this.square_adjust + bold}px`;
                                shadow.style.height = `${size * this.square_adjust + bold}px`;
                                shadow.style.backgroundColor = shadow_color;
                                shadow.style.pointerEvents = 'none';
                                shadow.style.position = 'absolute';
                                shadow.style.left = `${this.extra_x + col_index * size + size - italic_offset * row_index}px`;
                                shadow.style.top = `${row_index * size + size + y_offset}px`;
                                shadow.style.animation = animation;
                                container.appendChild(shadow);
    
                                let square = document.createElement('div');
                                square.style.width = `${size * this.square_adjust + bold}px`;
                                square.style.height = `${size * this.square_adjust + bold}px`;
                                square.style.backgroundColor = color;
                                square.style.pointerEvents = 'none';
                                square.style.position = 'absolute';
                                square.style.left = `${this.extra_x + col_index * size - italic_offset * row_index}px`;
                                square.style.top = `${row_index * size + y_offset}px`;
                                square.style.animation = animation;
                                container.appendChild(square);
    
                                destroy_data.push(square);
                                destroy_data.push(shadow);
                                only_square_data.push([square, shadow]);
    
                                if (glitch) {
                                    const apply_glitch = () => {
                                        let random_y_offset = Math.floor(Math.random() * (2 * size)) - size;
                                        square.style.top = `${row_index * size + random_y_offset}px`;
                                        shadow.style.top = `${row_index * size + size + random_y_offset}px`;
                                    };
    
                                    let interval = setInterval(apply_glitch, 0);
                                    this.glitch_intervals.push([interval, apply_glitch]);
                                }
                            }
                        });
                        letter_pixel_width = Math.max(letter_pixel_width, row.length * size);
                    });
                    this.extra_x += letter_pixel_width + spacing;
                } else {
                    console.warn(`Character "${letter}" not found in charmap.`);
                }
            } else {
                this.extra_x += size * spacing;
            }
        };
    
        for (let letter of this.text) {
            write_letter(letter, x, y, color, size, shadow_color);
        }
    
        if (underline) {
            let underline_div = document.createElement('div');
            underline_div.style.width = `${total_width - spacing}px`;
            underline_div.style.height = `${size / 2}px`;
            underline_div.style.backgroundColor = color;
            underline_div.style.pointerEvents = 'none';
            underline_div.style.position = 'absolute';
            underline_div.style.left = '0px';
            underline_div.style.top = `${max_height + size / 3}px`;
            container.appendChild(underline_div);
            destroy_data.push(underline_div);
        }

        if (strikethrough) {
            let strikethrough_div = document.createElement('div');
            strikethrough_div.style.width = `${total_width - spacing}px`;
            strikethrough_div.style.height = `${size / 3}px`;
            strikethrough_div.style.backgroundColor = color;
            strikethrough_div.style.pointerEvents = 'none';
            strikethrough_div.style.position = 'absolute';
            strikethrough_div.style.left = '0px';
            strikethrough_div.style.top = `${max_height / 2}px`;
            container.appendChild(strikethrough_div);
            destroy_data.push(strikethrough_div);
        }

        all_data.push(destroy_data);
        all_data.push(only_square_data);
        this.current_write_data = all_data;

        return all_data;
    }

    change_color(write_data, color) {
        for (let [square] of write_data[1]) {
            square.style.backgroundColor = color;
        }
    }

    change_text(newText, x, y, color = 'black', shadow_color = '#383838', size = 5, spacing = 3, square_adjust = 1, animation='none', rotation = 0) {
        if (this.current_write_data) {
            this.destroy(this.current_write_data);
        }
        this.write(newText, x, y, color, shadow_color, size, spacing, square_adjust, animation, rotation); 
    }

    destroy(data = null) {
        if (data === null) {
            if (this.current_write_data) {
                data = this.current_write_data;
            } else {
                console.warn('No data provided and no current write data available.');
                return;
            }
        }
    
        if (this.glitch_intervals) {
            this.glitch_intervals.forEach(interval => {
                clearInterval(interval[0]);
            });
            this.glitch_intervals = [];
        }
    
        if (Array.isArray(data)) {
            data[0].forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        }
    }

    expandContract(data, duration = 1000, easing = 'ease-in-out') {
        if (!data) {
            console.warn('No write data provided for expandContract animation.');
            return;
        }
    
        const startSpacing = 1; // Or whatever your base spacing should be
        const maxSpacingChange = 0.4; // Adjust for desired effect
        let startTime = null;
        let isExpanding = true;
    
        // Store original left, top, width, and height for each square
        data[1].forEach(([square, shadow]) => {
            square.originalLeft = parseFloat(square.style.left);
            square.originalTop = parseFloat(square.style.top);
            square.originalWidth = parseFloat(square.style.width);
            square.originalHeight = parseFloat(square.style.height);
            shadow.originalLeft = parseFloat(shadow.style.left);
            shadow.originalTop = parseFloat(shadow.style.top);
            shadow.originalWidth = parseFloat(shadow.style.width);
            shadow.originalHeight = parseFloat(shadow.style.height);
        });
    
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
    
            const spacingChange = isExpanding ? 
                maxSpacingChange * easeInOut(progress) : 
                maxSpacingChange - (maxSpacingChange * easeInOut(progress));
            const currentSpacing = startSpacing + spacingChange; 
    
            data[1].forEach(([square, shadow]) => {
                // Apply spacing to left and top properties relative to original positions
                square.style.left = `${square.originalLeft * currentSpacing}px`;
                square.style.top = `${square.originalTop * currentSpacing}px`;
                shadow.style.left = `${shadow.originalLeft * currentSpacing}px`; 
                shadow.style.top = `${shadow.originalTop * currentSpacing}px`;
    
                // Scale square and shadow sizes
                square.style.width = `${square.originalWidth * currentSpacing}px`;
                square.style.height = `${square.originalHeight * currentSpacing}px`;
                shadow.style.width = `${shadow.originalWidth * currentSpacing}px`;
                shadow.style.height = `${shadow.originalHeight * currentSpacing}px`;
            });
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isExpanding = !isExpanding;
                startTime = null;
                requestAnimationFrame(animate);
            }
        }
    
        function easeInOut(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
    
        requestAnimationFrame(animate);
    }
    

}



const charmap = {
    'a': `
00000
00000
00000
00000
0###0
0000#
0####
#000#
0####
`,
    'b': `
000000
000000
0#0000
0#0000
0#0##0
0##00#
0#000#
0#000#
0####0
`,
    'c': `
00000
00000
00000
00000
0###0
#000#
#0000
#000#
0###0
`,
    'd': `
00000
000000
0000#0
0000#0
0##0#0
#00##0
#000#0
#000#0
0####0
`,
    'e': `
00000
00000
00000
00000
0###0
#000#
#####
#0000
0####
`,
    'f': `
00000
00000
000##
00#00
0####
00#00
00#00
00#00
00#00
`,
    'g': `
00000
00000
00000
00000
0####
#000#
#000#
0####
0000#
####0
`,
    'h': `
000000
000000
0#0000
0#0000
0#0##0
0##00#
0#000#
0#000#
0#000#
`,
    'i': `
000
000
0#0
000
0#0
0#0
0#0
0#0
0#0
`,
    'j': `
00000
00000
0000#
00000
0000#
0000#
0000#
#000#
#000#
0###0
`,
    'k': `
00000
00000
#0000
#0000
#00#0
#0#00
##000
#0#00
#00#0
`,
    'l': `
000
000
0#0
0#0
0#0
0#0
0#0
0#0
00#
`,
    'm': `
00000
00000
00000
00000
##0#0
#0#0#
#0#0#
#000#
#000#
`,
    'n': `
00000
00000
00000
00000
####0
#000#
#000#
#000#
#000#
`,
    'o': `
00000
00000
00000
00000
0###0
#000#
#000#
#000#
0###0
`,
    'p': `
00000
00000
00000
00000
#0##0
##00#
#000#
####0
#0000
#0000
`,
    'q': `
00000
00000
00000
00000
0##0#
#00##
#000#
0####
0000#
0000#
`,
    'r': `
00000
00000
00000
00000
#0##0
##00#
#0000
#0000
#0000
`,
    's': `
00000
00000
00000
00000
0####
#0000
0###0
0000#
####0
`,
    't': `
000
000
0#0
0#0
###
0#0
0#0
0#0
00#
`,
    'u': `
00000
00000
00000
00000
#000#
#000#
#000#
#000#
0####
`,
    'v': `
00000
00000
00000
00000
#000#
#000#
#000#
0#0#0
00#00
`,
    'w': `
00000
00000
00000
00000
#000#
#000#
#0#0#
#0#0#
0####
`,
    'x': `
00000
00000
00000
00000
#000#
0#0#0
00#00
0#0#0
#000#
`,
    'y': `
00000
00000
00000
00000
#000#
#000#
#000#
0####
0000#
####0
`,
    'z': `
00000
00000
00000
00000
#####
000#0
00#00
0#000
#####
`,
    'A': `
00000
00000
0###0
#000#
#####
#000#
#000#
#000#
#000#
`,
    'B': `
00000
00000
####0
#000#
####0
#000#
#000#
#000#
####0
`,
    'C': `
00000
00000
0###0
#000#
#0000
#0000
#0000
#000#
0###0
`,
    'D': `
00000
00000
####0
#000#
#000#
#000#
#000#
#000#
####0
`,
    'E': `
00000
00000
#####
#0000
###00
#0000
#0000
#0000
#####
`,
    'F': `
00000
00000
#####
#0000
###00
#0000
#0000
#0000
#0000
`,
    'G': `
00000
00000
0####
#0000
#00##
#000#
#000#
#000#
0###0
`,
    'H': `
00000
00000
#000#
#000#
#####
#000#
#000#
#000#
#000#
`,
    'I': `
00000
00000
0###0
00#00
00#00
00#00
00#00
00#00
0###0
`,
    'J': `
00000
00000
0000#
0000#
0000#
0000#
0000#
#000#
0###0
`,
    'K': `
00000
00000
#000#
#00#0
###00
#00#0
#000#
#000#
#000#
`,
    'L': `
00000
00000
#0000
#0000
#0000
#0000
#0000
#0000
#####
`,
    'M': `
00000
00000
#000#
##0##
#0#0#
#000#
#000#
#000#
#000#
`,
    'N': `
00000
00000
#000#
##00#
#0#0#
#00##
#000#
#000#
#000#
`,
    'O': `
00000
00000
0###0
#000#
#000#
#000#
#000#
#000#
0###0
`,
    'P': `
00000
00000
####0
#000#
####0
#0000
#0000
#0000
#0000
`,
    'Q': `
00000
00000
0###0
#000#
#000#
#000#
#000#
#00#0
0##0#
`,
    'R': `
00000
00000
####0
#000#
####0
#000#
#000#
#000#
#000#
`,
    'S': `
00000
00000
0####
#0000
0###0
0000#
0000#
#000#
0###0
`,
    'T': `
00000
00000
#####
00#00
00#00
00#00
00#00
00#00
00#00
`,
    'U': `
00000
00000
#000#
#000#
#000#
#000#
#000#
#000#
0###0
`,
    'V': `
00000
00000
#000#
#000#
#000#
#000#
0#0#0
0#0#0
00#00
`,
    'W': `
00000
00000
#000#
#000#
#000#
#000#
#0#0#
##0##
#000#
`,
    'X': `
00000
00000
#000#
0#0#0
00#00
0#0#0
#000#
#000#
#000#
`,
    'Y': `
00000
00000
#000#
0#0#0
00#00
00#00
00#00
00#00
00#00
`,
    'Z': `
00000
00000
#####
0000#
000#0
00#00
0#000
#0000
#####
`,
    '0': `
0####0
#0000#
#0000#
#000##
#00#0#
#0#00#
##000#
#0000#
0####0
`,
    '1': `
000#00
00##00
000#00
000#00
000#00
000#00
000#00
000#00
0#####
`,
    '2': `
0####0
#0000#
00000#
0000#0
000#00
00#000
0#0000
#00000
######
`,
    '3': `
0####0
#0000#
00000#
00000#
00###0
00000#
00000#
#0000#
0####0
`,
    '4': `
0000##
000#0#
00#00#
0#000#
#0000#
######
00000#
00000#
00000#
`,
    '5': `
######
#00000
#####0
00000#
00000#
00000#
00000#
#0000#
0####0
`,
    '6': `
00###0
0#0000
#00000
#00000
#####0
#0000#
#0000#
#0000#
0####0
`,
    '7': `
######
#0000#
00000#
0000#0
000#00
000#00
000#00
000#00
000#00
`,
    '8': `
0####0
#0000#
#0000#
#0000#
0####0
#0000#
#0000#
#0000#
0####0
`,
    '9': `
0####0
#0000#
#0000#
#0000#
0#####
00000#
00000#
0000#0
0###00
`,
    '.': `
00
00
00
00
00
00
00
00
#0
`,
    '!': `
00
00
#0
#0
#0
#0
#0
00
#0
`,
    '?': `
00000
00000
0###0
#000#
0000#
000#0
00#00
00000
00#00
`,
    ',': `
00
00
00
00
00
00
00
00
#0
#0
`,
};


let eagwrite = new EagWrite(charmap);