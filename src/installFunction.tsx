import type { InstallHelp, Lang } from "./type"

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isFirefox(): boolean {
  const ua = navigator.userAgent;

  const hasInstallTrigger = typeof (window as any).InstallTrigger !== "undefined";
  if (hasInstallTrigger) return true;

  const isFxToken = /Firefox\/\d+/i.test(ua) || /FxiOS\/\d+/i.test(ua);

  const isSeaMonkey = /Seamonkey\/\d+/i.test(ua);

  return isFxToken && !isSeaMonkey;
}

export function installFunction(lang:Lang): InstallHelp{
  if(isFirefox() == false){
    if(isIOS() == true){
      return "ios"
    }else{
      return "browser"
    }
  }
  return "none"
}

/* Anleitungen */
export function ZeigeAnleitung({lang}:{lang:Lang}){

  return lang === "de"?(
      <div>
        <h2>Installationsanleitung für Edge/Chrome</h2>
        <p>1. Drücken Sie rechts in der URL Leiste auf den Installationsbutton.</p>
        <p>2. Bestätigen Sie die Installation, in dem Sie im Fenster auf "Installieren" drücken.</p>
        <p>3. Wählen Sie von den Einstellungen Ihre persönlichen Favoriten aus.</p>
        <p>4. Drücken Sie zum Schluss auf "zulassen".</p>
      </div>
  ):(
      <div>
        <h2>Installation Instructions for Edge/Chrome</h2>
        <p>1. Click the install button on the right side of the URL bar.</p>
        <p>2. Confirm the installation by clicking "install" in the window.</p>
        <p>3. Select your personal favorites from the settings.</p>
        <p>4. Finally press "allow".</p>
      </div>
  )
}

export function ZeigeAnleitung_IOS({lang}:{lang:Lang}){

  return lang === "de"?(
      <div>
        <h2>Installationsanleitung für IOS/ IPadOS - Geräte</h2>
        <p>1. Öffnen Sie das Menü „Teilen“, das sich unten oder oben im Browser befindet.</p>
        <p>2. Klicken Sie auf Zum Startbildschirm hinzufügen.</p>
        <p>3. Bestätigen Sie den Namen der App. Der Name kann vom Nutzer bearbeitet werden.</p>
        <p>4. Klicken Sie auf Hinzufügen. Unter iOS und iPadOS sehen Lesezeichen für Websites und PWAs auf dem Startbildschirm gleich aus.</p>
      </div>
  ):(
      <div>
        <h2>Installation Instructions for IOS/ IPadOS devices</h2>
        <p>1. Open the "share" menu, which is located at the bottom or top of your browser.</p>
        <p>2. Click on "add to home screen".</p>
        <p>3. Confirm the app name. The name can be edited by the user.</p>
        <p>4. Click "add". On iOS and iPadOS, bookmarks for websites and PWAs look the same on the home screen.</p>
      </div>
  )
}