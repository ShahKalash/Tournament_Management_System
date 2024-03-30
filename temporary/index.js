const ejs = require('ejs');
const fs = require('fs');

// Data to pass to the template
const data = { name: 'John' };

// Read the EJS template file
fs.readFile('index.ejs', 'utf8', (err, template) => {
    if (err) throw err;

    // Render the template with the data
    const rendered = ejs.render(template, data);

    // Write the rendered HTML to a new file
    fs.writeFile('index.html', rendered, (err) => {
        if (err) throw err;
        console.log('HTML file created successfully!');
    });
});