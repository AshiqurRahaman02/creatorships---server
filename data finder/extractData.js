const cheerio = require("cheerio");
const fs = require("fs");

// Simulate loading HTML content from a file
const html = fs.readFileSync("index.html", "utf-8");

// Load HTML into cheerio
const $ = cheerio.load(html);

// Check if tbody exists
if ($("tbody").length === 0) {
	console.error("No tbody element found");
} else {
	const data = [];

	// Iterate over each <tr> in <tbody>
	$("tbody tr").each((i, tr) => {
		const row = {};

		// Iterate over each <td> in the current <tr>
		$(tr)
			.find("td")
			.each((j, td) => {
				if (i == 0) {
					console.log("Processing col", j);
				}
				if (j == 1 || j == 2 || j == 3) {
					let links = [];
					$(td)
						.find("a")
						.each((k, a) => {
							const href = $(a).attr("href");
							if (href) {
								links.push({
									linkText: $(a).text().trim(),
									linkHref: href,
								});
							}
						});
					let data = $(td)
						.text()
						.trim()
						

					if (j == 1) {
						row.person= { data:parseText(data), links } ;
					} else if (j == 2) {
						row.company= { data:parseText(data), links }
					} else if (j == 3) {
						row.information={ data:parseText(data), links }
					}
				}
			});

		data.push(row);
	});

    function parseText(input) {
        const normalized = input.trim().replace(/\t+/g, '\n');
        
        const parts = normalized.split('\n');
      
        const cleanedParts = parts.map(part => part.trim()).filter(part => part.length > 0);
        
        return cleanedParts;
      }

	// Write data to JSON file
	fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");
	console.log("Data written to data.json");
}
