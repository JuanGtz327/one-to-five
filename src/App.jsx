import {
  Button,
  ButtonGroup,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import Toastify from "toastify-js";
import { FaVolumeMute, FaVolumeDown } from "react-icons/fa";

function Next({ nextView, delay = "animate-delay-[1200ms]", label = "Okey" }) {
  const [btnA] = useState(new Audio("./one-to-five/button.wav"));
  return (
    <div
      className={`ml-auto mt-5 cursor-pointer animate-fade-down ${delay} w-fit`}
    >
      <p className="flex items-center gap-2 border px-2 rounded bg-white text-black" onClick={() => {nextView();btnA.play()}}>{label} <FaAnglesRight /></p>
    </div>
  );
}

function Question({
  setCounter,
  label = "Okey",
  bg = "bg-black",
  image,
  variant = "normal",
}) {
  const [disableBtns, setDisableBts] = useState(false);

  let btnLabels = ["Uno", "DOS", "TLE", "IIII", "✋"];

  if (variant == "tlaxcala") {
    btnLabels = ["Que", "Ro", "man", "ti", "co"];
  }

  if (variant == "besito") {
    btnLabels = ["😚", "😚", "😚", "😚", "😚"];
  }

  return (
    <>
      <div className={`${bg} tarjeta`}>
        One to Five
        <hr className="my-2" />
        {label}
        <div className="flex w-max flex-col gap-4 mt-5 mx-auto">
          <ButtonGroup className="bg-transparent border-0">
            <Button
              disabled={disableBtns}
              className="bg-blue-500 border-0 animate-fade animate-delay-100"
              onClick={() => {
                setCounter(
                  variant == "dormir" ? 500 : 1,
                  variant,
                  "Lo sabia 🫡"
                );
                setDisableBts(true);
              }}
            >
              {btnLabels[0]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-lime-500 text-black animate-fade animate-delay-300"
              onClick={() => {
                setCounter(
                  variant == "dormir" ? 400 : 2,
                  variant,
                  "Estas cerca!!!!!"
                );
                if (variant == "lectura") return;
                setDisableBts(true);
              }}
            >
              {btnLabels[1]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-cyan-700 animate-fade animate-delay-500"
              onClick={() => {
                setCounter(
                  variant == "dormir" ? 300 : 3,
                  variant,
                  "Puedes hacerlo mejor 🤨"
                );
                if (variant == "lectura") return;
                setDisableBts(true);
              }}
            >
              {btnLabels[2]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-pink-400 animate-fade animate-delay-700"
              onClick={() => {
                setCounter(
                  variant == "dormir" ? 200 : 4,
                  variant,
                  "Esta menos 🤠"
                );
                if (variant == "lectura") return;
                setDisableBts(true);
              }}
            >
              {btnLabels[3]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-teal-500 animate-fade animate-delay-1000"
              onClick={() => {
                setCounter(5, variant, "Esta no 🤭");
                if (variant == "lectura") return;
                setDisableBts(true);
              }}
            >
              {btnLabels[4]}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="w-48 h-48 flex items-center justify-center mt-12 mx-auto bg-white rounded-full animate-wiggle-more animate-infinite animate-duration-[1500ms]">
        <img
          src={`${image == 0 ? "./ella.png" : "./el.png"}`}
          alt="bidabid"
          className="w-36 rounded-3xl"
        />
      </div>
    </>
  );
}

function App() {
  const [vista, setVista] = useState(0);
  const [counter, setCounter] = useState(0);
  const [open, setOpen] = useState(false);
  const [audio] = useState(new Audio("./one-to-five/base.mp3"));
  const [final] = useState(new Audio("./one-to-five/final.mp3"));
  const [alertA] = useState(new Audio("./one-to-five/alert.wav"));
  const [alertF] = useState(new Audio("./one-to-five/alertF.wav"));
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    if (audio.paused) {
      audio.loop = true;
      audio.volume = 0.7
      audio.play();
    } else {
      audio.pause();
    }
  };

  const toggleMute = () => {
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  useEffect(() => {
    if (vista === 2) {
      togglePlay();
    }

    if(open===true){
      audio.pause()
      final.play();
    }

    if(open===false){
      final.pause();
    }
  });

  const handleOpen = () => setOpen(!open);

  const nextView = () => {
    setVista(vista + 1);
  };

  const showToasty = (msg, bg = "bg-light-green-600") => {
    Toastify({
      text: msg,
      className: `z-10 w-fit px-5 fixed right-10 h-10 text-center rounded-xl animate-jump-in text-gray-200 ${bg} flex items-center justify-center`,
      duration: 2800,
      close: false,
      stopOnFocus: true,
    }).showToast();
  };

  const onSetCounter = (value, variant, label) => {
    const labels = [
      "Que linda eres :D",
      "¿Extrañarte? Claro que SI",
      "Con mil rosas para mi 🎵",
      "HOTKEYS 🥞",
      "Uinguardium lebiosa",
    ];
    let toastyText = labels[Math.floor(Math.random() * 5)];
    let audioToPlay = true

    if (variant == "siempre5") {
      toastyText = "Lo que escojas esta vale 500 :)";
      value = 500;
    }

    if (variant == "tlaxcala") {
      toastyText = "Pueblo magico +1000pts";
      value = value + 1000;
    }

    if (variant == "XD") {
      toastyText = "XD";
      value = 1000;
    }

    if (variant == "lectura" && label != "Lo sabia 🫡") {
      showToasty(label, "bg-red-500");
      alertF.play()
      return;
    }

    if (variant == "lectura" && label == "Lo sabia 🫡")
      toastyText = "Lo sabia 🫡";

    if (variant == "musica") {
      value = value * 100;
      toastyText = `🎵🎺🎸🎹 +${value}pts`;
    }

    if (variant == "besito") {
      toastyText = "👁️👄👁️";
      value = 10000 * value;
    }

    if (variant == "dormir" && value > 5) {
      toastyText = `BUUUUU 👎 -${value}pts`;
      value = -value;
      audioToPlay=false
    } else if (variant == "dormir" && value == 5) {
      toastyText = "Que emocion !!!!!";
    }

    if (audioToPlay) {
      alertA.play()
    }else{
      alertF.play()
    }

    showToasty(
      toastyText,
      variant == "dormir" && value < 0 ? "bg-red-500" : "bg-light-green-600"
    );
    setCounter(counter + value);
    setTimeout(() => {
      nextView();
    }, 3000);
  };

  return (
    <>
      {vista > 1 && (
        <div className="bg-gray-900 text-5xl fixed top-10 lg:left-[40%] lg:w-96 w-fit left-14 flex gap-2 rounded-xl px-5 py-2 justify-center animate-shake animate-infinite animate-alternate-reverse animate-duration-[5000ms]">
          <p className="text-blue-400 animate-jump-in animate-delay-300">
            ONE
          </p>
          <p className="text-white animate-jump-in animate-delay-500">
            to
          </p>
          <p className="text-purple-500 animate-jump-in animate-delay-700">
            FiVe
          </p>
        </div>
      )}
      {vista === 0 && (
        <div className="bg-blue-500 tarjeta">
          Hola!!
          <br />
          Soy yo de nuevo, el chico de ingenieria haciendo uso de las habilidades
          que adquiri durante mi estudio, para hacer este detalle.
          <Next nextView={nextView} />
        </div>
      )}
      {vista === 1 && (
        <div className="bg-amber-700 tarjeta">
          Estoy muy feliz sabes, hace 1 mes desde que estamos juntos y
          creeme que ha sido tan genial pasarlo contigo.
          <br />
          <br />
          Es por ello me he tomado el tiempo para crear el siguiente minijuego, se llama!!!!!
          🥁🥁🥁🥁🥁 
          <Next nextView={nextView} label="Como se llama?" />
        </div>
      )}
      {vista === 2 && (
        <div className="bg-light-green-600 tarjeta">
          Instrucciones
          <br />
          A continuacion apareceran distintas preguntas, de las cuales tendras
          que seleccionar en una escala de 1 al 5 que tanto quieres realizar
          dicha accion.
          <br /> <br />
          Al finalizar tendras tu analisis :D
          <br />
          <br />
          <p className="animate-fade-down animate-delay-[5000ms]">LISTA?</p>
          <Next
            nextView={nextView}
            delay="animate-delay-[7000ms]"
            label="LISTA!!"
          />
        </div>
      )}
      {vista === 3 && (
        <Question
          setCounter={onSetCounter}
          label="Tener un maraton de peliculas tan bizarras e incoherentes que nos
        dejen un licuado mental 🫨 pero con opcion de debate"
          image={0}
        />
      )}
      {vista === 4 && (
        <Question
          setCounter={onSetCounter}
          label="Visitar un sin fin de museos (Como el castillo) y tomar fotitos para mostrar que tan fascinados estamos por el arte 🤳"
          image={1}
        />
      )}
      {vista === 5 && (
        <Question
          setCounter={onSetCounter}
          label="Picnic con bebidas que alteran los 5 sentidos 👹"
          image={0}
        />
      )}
      {vista === 6 && (
        <Question
          setCounter={onSetCounter}
          label="Tener abrazitos (Sin blutut) 😌 con el creador de este jueguito"
          image={1}
          variant="siempre5"
        />
      )}
      {vista === 7 && (
        <Question
          setCounter={onSetCounter}
          label="Crear una carrera de tortugas donde apostaremos todas nuestras finanzas, para despues cometer fraude fiscal 🤑"
          image={0}
        />
      )}
      {vista === 8 && (
        <Question
          setCounter={onSetCounter}
          label="Visitar Tlaxcala o Toluca o cualquier lugar que empieze con T (Tu corazon) 🤠"
          image={1}
          variant="tlaxcala"
        />
      )}
      {vista === 9 && (
        <Question setCounter={onSetCounter} label="XD" variant="XD" />
      )}
      {vista === 10 && (
        <Question
          setCounter={onSetCounter}
          label="Poner al creador de este juego a leer un libro de unas 500 paginas 👀"
          image={0}
          variant="lectura"
        />
      )}
      {vista === 11 && (
        <Question
          setCounter={onSetCounter}
          label="Revolucionar el arte de comunicarse a traves de 101 reel diarios, asi como emojis y stickers 💯"
          image={1}
        />
      )}
      {vista === 12 && (
        <Question
          setCounter={onSetCounter}
          label="Escuchar una playlist de 8hrs de duracion, claro que si 🎵"
          image={0}
          variant="musica"
        />
      )}
      {vista === 13 && (
        <Question
          setCounter={onSetCounter}
          label="✅✅✅ Desvelarse por 1 SEMANA ✅✅✅"
          image={1}
          variant="dormir"
        />
      )}
      {vista === 14 && (
        <Question
          setCounter={onSetCounter}
          label="Preparar gelatina verde y asi ayudar a Carlitos y a Tommy a dormir 👨‍🍳"
          image={0}
        />
      )}
      {vista === 15 && (
        <Question
          setCounter={onSetCounter}
          label="¿Besito?"
          image={1}
          variant="besito"
        />
      )}

      {vista >= 3 && vista <= 15 && (
        <div className="bg-white w-fit mx-auto mt-5 rounded px-10 py-1">
          <p>Puntuacion: {counter}</p>
        </div>
      )}

      {vista === 16 && counter < 53041 && (
        <div className="bg-blue-gray-800 tarjeta">
          <p>Puntuacion Final: {counter}</p>
          <br />
          <p>
            A que ha sido un momento de relajacion jajaja, sin embargo debes
            conseguir 53041pts para desbloquear el final del juego.
          </p>
          <img
            src="./el.png"
            alt="bidabid"
            className="w-36 rounded mx-auto py-10"
          />
          <div className="flex justify-center mt-5">
            <Button
              color="blue"
              onClick={() => {
                setVista(3);
                setCounter(0);
              }}
            >
              Intentar otra vez
            </Button>
          </div>
        </div>
      )}

      {vista === 16 && counter >= 53041 && (
        <div className="bg-purple-600 tarjeta">
          <p>Puntuacion Final: {counter}</p>
          <br />
          <p>
            Enhorabuena!!! Haz conseguido superar el juego presiona el boton
            para ver el final secreto :D
          </p>
          <img
            src="./ella.png"
            alt="bidabid"
            className="w-36 rounded mx-auto py-10"
          />
          <div className="flex justify-center mt-5">
            <Button
              color="amber"
              onClick={() => {
                handleOpen();
                setVista(0);
                setCounter(0);
              }}
            >
              Final Secreto
            </Button>
          </div>
        </div>
      )}
      {vista >= 2 && (
        <div className="fixed bottom-5 right-5">
          <Button onClick={toggleMute} className="p-3 bg-white text-black">
            {muted ? (
              <FaVolumeDown className="h-6 w-6" />
            ) : (
              <FaVolumeMute className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}
      <Dialog open={open} handler={handleOpen} className="bg-black">
        <DialogBody>
          <div className="relative h-[58vh] lg:h-[60vh] flex items-center justify-center">
            <img
              src="us.jpg"
              alt="Fondo"
              className="absolute inset-0 object-cover opacity-50 h-[500px] lg:h-[588px] w-full"
            />
            <div className="absolute inset-0 flex items-end justify-center w-fit">
              <div className="flex flex-col gap-5 animate-fade animate-duration-[8000ms]">
                <h1 className="text-sm font-bold text-white">
                  Que sepas que te quiero mucho, que eres sin duda una chica muy
                  linda, que me agrada como eres, tus gustos, tu forma de
                  expresarte, que eres inteligente esa mirada la cual no puedo
                  parar de contemplar.
                </h1>
                <h1 className="text-sm font-bold text-white">
                  Tantos abrazos y besos son los que te mando en este instante
                  por que hoy mas que nunca lo vales
                </h1>
                <div className="flex items-center gap-3">
                  <h1 className="text-sm font-bold text-white">TQM</h1>
                  <div className="heart"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="gradient"
              color="green"
              onClick={handleOpen}
              className="mt-14 w-[150px]"
            >
              <span>Volver</span>
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}

export default App;
