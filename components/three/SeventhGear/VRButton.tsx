import { WebGLRenderer } from "three";

interface VRButtonProps {
  renderer: WebGLRenderer;
}

const VRButton = ({ renderer }: VRButtonProps) => {
  const button = document.createElement("button");
  button.style.display = "none";
  button.style.height = "40px";

  const stylizeElement = (
    element: HTMLElement,
    active = true,
    fontSize = 13,
    ignorePadding = false
  ) => {
    element.style.position = "absolute";
    element.style.bottom = "20px";
    if (!ignorePadding) element.style.padding = "12px 6px";
    element.style.border = "1px solid #fff";
    element.style.borderRadius = "4px";
    element.style.background = active
      ? "rgba(20,150,80,1)"
      : "rgba(180,20,20,1)";
    element.style.color = "#fff";
    element.style.font = `normal ${fontSize}px sans-serif`;
    element.style.textAlign = "center";
    element.style.opacity = "0.5";
    element.style.outline = "none";
    element.style.zIndex = "999";
  };

  if ("xr" in navigator) {
    navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
      supported ? showEnterVR(button) : showWebXRNotFound(button);
    });

    document.body.appendChild(button);
  } else {
    const message = document.createElement("a");

    if (window.isSecureContext === false) {
      message.href = document.location.href.replace(/^http:/, "https:");
      message.innerHTML = "WEBXR NEEDS HTTPS";
    } else {
      message.href = "https://immersiveweb.dev/";
      message.innerHTML = "WEBXR NOT AVAILABLE";
    }

    stylizeElement(message, false);
    message.style.left = "0px";
    message.style.width = "100%";
    message.style.textDecoration = "none";
    message.style.bottom = "0px";
    message.style.opacity = "1";

    document.body.appendChild(message);
  }

  const showEnterVR = (button: HTMLButtonElement) => {
    let currentSession: XRSession | null = null;

    stylizeElement(button, true, 30, true);

    const onSessionStarted = (session: XRSession) => {
      session.addEventListener("end", onSessionEnded);

      renderer.xr.setSession(session);
      stylizeElement(button, false, 12, true);

      button.textContent = "EXIT VR";

      currentSession = session;
    };

    const onSessionEnded = () => {
      if (currentSession) {
        currentSession.removeEventListener("end", onSessionEnded);
      }

      stylizeElement(button, true, 12, true);
      button.textContent = "ENTER VR";

      currentSession = null;
    };

    button.style.display = "";
    button.style.right = "20px";
    button.style.width = "80px";
    button.style.cursor = "pointer";
    button.innerHTML = '<i class="fas fa-vr-cardboard"></i>';

    button.onmouseenter = () => {
      button.style.fontSize = "12px";
      button.textContent = currentSession === null ? "ENTER VR" : "EXIT VR";
      button.style.opacity = "1.0";
    };

    button.onmouseleave = () => {
      button.style.fontSize = "30px";
      button.innerHTML = '<i class="fas fa-vr-cardboard"></i>';
      button.style.opacity = "0.5";
    };

    button.onclick = () => {
      if (currentSession === null) {
        const sessionInit = {
          optionalFeatures: ["local-floor", "bounded-floor"],
        };
        navigator.xr
          .requestSession("immersive-vr", sessionInit)
          .then(onSessionStarted);
      } else {
        currentSession.end();
      }
    };
  };

  const showWebXRNotFound = (button: HTMLButtonElement) => {
    stylizeElement(button, false);
    disableButton(button);

    button.style.display = "";
    button.style.width = "100%";
    button.style.right = "0px";
    button.style.bottom = "0px";
    button.style.border = "";
    button.style.opacity = "1";
    button.style.fontSize = "13px";
    button.textContent = "VR NOT SUPPORTED";
  };

  const disableButton = (button: HTMLButtonElement) => {
    button.style.cursor = "auto";
    button.style.opacity = "0.5";

    button.onmouseenter = null;
    button.onmouseleave = null;

    button.onclick = null;
  };
};

export { VRButton };
