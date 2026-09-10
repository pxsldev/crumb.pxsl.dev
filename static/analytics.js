(function () {
    const GA_ID = "G-Q3XMQ05FK7";
    const CONSENT_KEY = "analytics_consent";

    function loadGoogleAnalytics() {
        if (document.getElementById("google-analytics-script")) {
            return;
        }

        const script = document.createElement("script");
        script.id = "google-analytics-script";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        window.gtag = gtag;

        gtag("js", new Date());
        gtag("config", GA_ID);
    }

    function setConsent(value) {
        localStorage.setItem(CONSENT_KEY, value);

        const banner = document.getElementById("analytics-consent-banner");

        if (banner) {
            banner.remove();
        }

        if (value === "yes") {
            loadGoogleAnalytics();
        }
    }

    function createBanner() {
        if (document.getElementById("analytics-consent-banner")) {
            return;
        }

        const banner = document.createElement("div");
        banner.id = "analytics-consent-banner";

        banner.innerHTML = `
            <div class="analytics-consent-content">
                <div class="analytics-consent-text">
                    <strong>Can we use analytics?</strong>
                    <p>
                        We use Google Analytics to understand how people use this
                        website and improve it. Analytics is optional and you can
                        change your choice at any time.
                    </p>
                </div>

                <div class="analytics-consent-buttons">
                    <button id="analytics-no">No</button>
                    <button id="analytics-yes">Yes</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById("analytics-no").addEventListener("click", function () {
            setConsent("no");
        });

        document.getElementById("analytics-yes").addEventListener("click", function () {
            setConsent("yes");
        });
    }

    function showAnalyticsSettings() {
        localStorage.removeItem(CONSENT_KEY);
        createBanner();
    }

    window.showAnalyticsSettings = showAnalyticsSettings;

    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === "yes") {
        loadGoogleAnalytics();
    } else if (!consent) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createBanner);
        } else {
            createBanner();
        }
    }
})();