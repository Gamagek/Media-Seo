const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzFvYsbbmA5BNsXYJjRQHJlFfRGlvuq7Uy98Qj4Nos23RVoLigMM4u7NLg2qHnqiuNo/exec";

async function compareProducts() {
    const productA = document.getElementById('productA').value.trim();
    const productB = document.getElementById('productB').value.trim();
    
    const loader = document.getElementById('loader');
    const resultsGrid = document.getElementById('resultsGrid');
    const errorBox = document.getElementById('errorBox');
    const compareBtn = document.getElementById('compareBtn');

    if (!productA || !productB) {
        alert("Please fill in both product fields.");
        return;
    }

    errorBox.classList.add('hidden');
    resultsGrid.classList.add('hidden');
    loader.classList.remove('hidden');
    loader.style.display = 'flex';
    compareBtn.disabled = true;

    try {
        const requestUrl = `${GAS_WEBAPP_URL}?productA=${encodeURIComponent(productA)}&productB=${encodeURIComponent(productB)}`;
        
        const response = await fetch(requestUrl);
        const json = await response.json();

        if (json.error) {
            throw new Error(json.error);
        }

        document.getElementById('titleA').innerText = productA;
        document.getElementById('contentA').innerHTML = marked.parse(json.productA || "No data returned.");

        document.getElementById('titleB').innerText = productB;
        let combinedB = json.productB || "";
        let parts = combinedB.split("--- subgroups ---");
        
        let finalHTML = marked.parse(parts[0] || "");
        if (parts[1]) {
            let upgradeMarkdown = parts[1];
            
            upgradeMarkdown = upgradeMarkdown.replace(
                /(\+?\d+%\s*(?:Performance Boost|Combined Frame-Rate Fluidity & Battery Life Boost|Peak CPU Voltage and Key Power Performance Boost)?)/gi, 
                (match, p1) => {
                    let digits = parseInt(p1.replace(/\D/g, '')) || 25;
                    let width = Math.min(digits * 2.5, 100);
                    return `<span class="perf-text-tag">${match}</span><div class="perf-bar-container"><div class="perf-bar-fill" style="width: ${width}%;"></div></div>`;
                }
            );

            finalHTML += `<hr class="my-6 border-slate-200"><h3 class="text-base font-bold text-slate-900 mb-3">3. VIP Upgrade Intelligence</h3>` + marked.parse(upgradeMarkdown);
        }
        document.getElementById('contentB').innerHTML = finalHTML;

        resultsGrid.classList.remove('hidden');
    } catch (err) {
        errorBox.innerText = `Analysis failed: ${err.message}`;
        errorBox.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
        loader.style.display = 'none';
        compareBtn.disabled = false;
    }
}
