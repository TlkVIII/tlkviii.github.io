(function () {
    "use strict";

    const measurementId = "G-RXJNW6WN37";
    const storageKey = "portfolio.analytics.consent.v1";
    const disableKey = "ga-disable-" + measurementId;
    let analyticsEnabled = false;
    let consentBanner = null;

    function getConsent() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function saveConsent(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (error) {
            // Le choix reste valable sur la page lorsque le stockage est inaccessible.
        }
    }

    function sendEvent(name, parameters) {
        if (!analyticsEnabled || typeof window.gtag !== "function") {
            return;
        }

        window.gtag("event", name, parameters || {});
    }

    function getProjectName(element) {
        const card = element.closest(".project-card");

        if (card) {
            const title = card.querySelector("h3");

            if (title) {
                return title.textContent.trim();
            }
        }

        return document.body.getAttribute("data-project-name") || "";
    }

    function registerClickTracking() {
        document.addEventListener("click", function (event) {
            const target = event.target.closest("a, button");

            if (!target || !analyticsEnabled) {
                return;
            }

            const customEvent = target.getAttribute("data-analytics-event");

            if (customEvent) {
                const projectName = target.getAttribute("data-analytics-project") || getProjectName(target);
                const parameters = {};

                if (projectName) {
                    parameters.project_name = projectName;
                }

                sendEvent(customEvent, parameters);
                return;
            }

            if (target.classList.contains("project-detail-link")) {
                sendEvent("project_open", { project_name: getProjectName(target) });
                return;
            }

            if (
                target.classList.contains("project-live-link") ||
                target.matches(".hero-actions a[target='_blank'], .closing-actions a[target='_blank']")
            ) {
                sendEvent("project_demo", {
                    project_name: getProjectName(target),
                    destination: target.href
                });
                return;
            }

            if (target.hasAttribute("download")) {
                sendEvent("cv_download", { document_name: "CV_Fayed_AMOURANI.pdf" });
                return;
            }

            if ((target.getAttribute("href") || "").includes("cv/cv.pdf")) {
                sendEvent("cv_open", { document_name: "CV_Fayed_AMOURANI.pdf" });
            }
        });
    }

    function enableAnalytics() {
        if (analyticsEnabled) {
            return;
        }

        window[disableKey] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        window.gtag("consent", "default", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
        window.gtag("js", new Date());
        window.gtag("config", measurementId, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
        });

        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
        document.head.appendChild(script);

        analyticsEnabled = true;

        const projectName = document.body.getAttribute("data-project-name");

        if (projectName) {
            sendEvent("project_view", { project_name: projectName });
        }

        const search = new URLSearchParams(window.location.search);

        if (search.get("utm_medium") === "qr") {
            sendEvent("qr_portfolio_visit", {
                traffic_source: search.get("utm_source") || "qr",
                campaign: search.get("utm_campaign") || "portfolio"
            });
        }
    }

    function disableAnalytics() {
        if (typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied"
            });
        }

        analyticsEnabled = false;
        window[disableKey] = true;

        document.cookie.split(";").forEach(function (entry) {
            const name = entry.split("=")[0].trim();

            if (name === "_ga" || name.indexOf("_ga_") === 0) {
                document.cookie = name + "=; Max-Age=0; path=/";
                document.cookie = name + "=; Max-Age=0; path=/; domain=" + window.location.hostname;
            }
        });
    }

    function closeBanner() {
        if (consentBanner) {
            consentBanner.hidden = true;
        }
    }

    function updateConsent(value) {
        saveConsent(value);

        if (value === "accepted") {
            enableAnalytics();
        } else {
            disableAnalytics();
        }

        closeBanner();
    }

    function showBanner() {
        if (!consentBanner) {
            consentBanner = document.createElement("section");
            consentBanner.className = "analytics-consent-banner";
            consentBanner.setAttribute("role", "dialog");
            consentBanner.setAttribute("aria-label", "Préférences de mesure d'audience");
            consentBanner.innerHTML =
                '<div class="analytics-consent-copy">' +
                    '<span class="analytics-consent-icon" aria-hidden="true"><i class="fas fa-chart-simple"></i></span>' +
                    '<div><strong>Mesure d’audience</strong>' +
                    '<p>Avec votre accord, Google Analytics mesure les visites, les projets consultés et les clics sur ce portfolio. Vous pouvez modifier votre choix à tout moment.</p></div>' +
                '</div>' +
                '<div class="analytics-consent-actions">' +
                    '<button type="button" class="analytics-consent-button analytics-consent-reject">Refuser</button>' +
                    '<button type="button" class="analytics-consent-button analytics-consent-accept">Accepter</button>' +
                '</div>';

            document.body.appendChild(consentBanner);

            consentBanner.querySelector(".analytics-consent-accept").addEventListener("click", function () {
                updateConsent("accepted");
            });

            consentBanner.querySelector(".analytics-consent-reject").addEventListener("click", function () {
                updateConsent("rejected");
            });
        }

        consentBanner.hidden = false;
    }

    document.querySelectorAll("[data-analytics-preferences]").forEach(function (button) {
        button.addEventListener("click", showBanner);
    });

    registerClickTracking();

    const consent = getConsent();

    if (consent === "accepted") {
        enableAnalytics();
    } else if (consent === "rejected") {
        window[disableKey] = true;
    } else {
        window[disableKey] = true;
        showBanner();
    }
})();
