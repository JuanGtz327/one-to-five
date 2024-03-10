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
import levels from "./data/levels.json";

const GAME_LABELS = [
  "Que linda eres :D",
  "¿Extrañarte? Claro que SI",
  "Con mil rosas para mi 🎵",
  "HOTKEYS 🥞",
  "Uinguardium lebiosa",
];

const BTN_LABELS = ["Uno", "DOS", "TLE", "IIII", "✋"];

function Question({ setCounter, data, bg = "bg-black" }) {
  const [disableBtns, setDisableBts] = useState(false);
  const [buttonLabels, setButtonLabels] = useState(BTN_LABELS);

  const { id, question, absolute_toasty_text, answers, absolute_value } = data;

  useEffect(() => {
    if (answers) {
      const variantLabels = answers.map((answer, i) => {
        if (answer.label) return answer.label;
        else return BTN_LABELS[i];
      });

      setButtonLabels(variantLabels);
    }
  }, [answers]);

  const onClick = (defaulValue, index) => {
    let finalValue = defaulValue;
    let finalValid = true;
    let finalSuccess = true;
    let finalToastyLabel = null;
    let finalAbsoluteToastyLabel = null;

    if (answers && answers[index].value) finalValue = answers[index].value;

    if (answers && answers[index].invalid) finalValid = false;

    if (answers && answers[index].failure) finalSuccess = false;

    if (answers && answers[index].toasty_text)
      finalToastyLabel = answers[index].toasty_text;

    if (absolute_toasty_text) finalAbsoluteToastyLabel = absolute_toasty_text;

    if (absolute_value) finalValue = absolute_value;

    setCounter(
      finalValue,
      finalValid,
      finalSuccess,
      finalToastyLabel,
      finalAbsoluteToastyLabel
    );

    if (finalValid) setDisableBts(true);
  };

  return (
    <>
      <div className={`${bg} tarjeta animate-jump-in mt-40 lg:mt-[10%]`}>
        One to Five
        <hr className="my-2" />
        {question}
        <div className="flex w-max flex-col gap-4 mt-5 mx-auto">
          <ButtonGroup className="bg-transparent border-0">
            <Button
              disabled={disableBtns}
              className="bg-blue-500 border-0 animate-fade animate-delay-100"
              onClick={() => onClick(1, 0)}
            >
              {buttonLabels[0]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-lime-500 text-black animate-fade animate-delay-300"
              onClick={() => onClick(2, 1)}
            >
              {buttonLabels[1]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-cyan-700 animate-fade animate-delay-500"
              onClick={() => onClick(3, 2)}
            >
              {buttonLabels[2]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-pink-400 animate-fade animate-delay-700"
              onClick={() => onClick(4, 3)}
            >
              {buttonLabels[3]}
            </Button>
            <Button
              disabled={disableBtns}
              className="bg-teal-500 animate-fade animate-delay-1000"
              onClick={() => onClick(5, 4)}
            >
              {buttonLabels[4]}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="w-48 h-48 flex items-center justify-center mt-12 mx-auto bg-white rounded-full animate-wiggle-more animate-infinite animate-duration-[1500ms]">
        <img
          src={`${
            id % 2 == 0
              ? import.meta.env.BASE_URL + "/ella.png"
              : import.meta.env.BASE_URL + "/el.png"
          }`}
          alt="bidabid"
          className="w-36 rounded-3xl"
        />
      </div>
    </>
  );
}

function App() {
  console.log(import.meta.env.DEV);
  console.log(import.meta.env.BASE_URL);

  //Variables globales del juego
  const [LEVEL, setLEVEL] = useState(0);
  const [GAME_STARTED, setGAME_STARTED] = useState(false);
  const [GAME_ENDED, setGAME_ENDED] = useState(false);
  const [GAME_INSTRUCTIONS, setGAME_INSTRUCTIONS] = useState(false);
  const [QUESTIONS, setQUESTIONS] = useState([]);
  const [CURRENT_QUESTION, setCURRENT_QUESTION] = useState(0);
  const [PTS, setPTS] = useState(0);

  //Recursos del juego
  const [audio] = useState(new Audio(import.meta.env.BASE_URL + "/base.mp3"));
  const [final] = useState(new Audio(import.meta.env.BASE_URL + "/final.mp3"));
  const [SUCCESS_AUDIO] = useState(
    new Audio(import.meta.env.BASE_URL + "/alert.wav")
  );
  const [FAILURE_AUDIO] = useState(
    new Audio(import.meta.env.BASE_URL + "/alertF.wav")
  );
  const [btnA] = useState(
    new Audio(import.meta.env.DEV ? "./one-to-five/button.wav" : "./button.wav")
  );

  const [muted, setMuted] = useState(false);
  const [VIEW, setVIEW] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const toggleMute = () => {
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  useEffect(() => {
    const levelQuestions = levels[LEVEL].questions;

    const onSetCounter = (
      value,
      valid,
      success,
      toastyLabel,
      absoluteToastyLabel
    ) => {
      let toastyText =
        GAME_LABELS[Math.floor(Math.random() * GAME_LABELS.length)];

      if (success) SUCCESS_AUDIO.play();
      else FAILURE_AUDIO.play();

      if (toastyLabel) toastyText = toastyLabel;

      if (absoluteToastyLabel) showToasty(absoluteToastyLabel, success);
      else showToasty(toastyText, success);

      if (!valid) return;

      setPTS(PTS + value);

      
      setTimeout(() => {
        if (CURRENT_QUESTION + 1 === levelQuestions.length) {
          setGAME_ENDED(true);
        }
        setCURRENT_QUESTION(CURRENT_QUESTION + 1);
      }, 1500);
    };

    const questionComponents = levelQuestions.map((levelQuestion) => {
      return (
        <Question
          key={levelQuestion.id}
          setCounter={onSetCounter}
          data={levelQuestion}
        />
      );
    });

    setQUESTIONS(questionComponents);
  }, [LEVEL, CURRENT_QUESTION, PTS, FAILURE_AUDIO, SUCCESS_AUDIO]);

  useEffect(() => {
    const togglePlay = () => {
      if (audio.paused) {
        audio.loop = true;
        audio.volume = 0.7;
        audio.play();
      } else {
        audio.pause();
      }
    };

    if (GAME_STARTED) {
      togglePlay();
    }

    if (open === true) {
      audio.pause();
      final.play();
    }

    if (open === false) {
      final.pause();
    }
  }, [VIEW, audio, final, open, GAME_STARTED]);

  const showToasty = (msg, valid) => {
    const bg = valid ? "bg-light-green-600" : "bg-red-500";

    Toastify({
      text: msg,
      className: `z-10 w-fit px-5 fixed right-10 h-10 text-center rounded-xl animate-jump-in text-gray-200 ${bg} flex items-center justify-center`,
      duration: 1000,
      close: false,
      stopOnFocus: true,
    }).showToast();
  };

  return (
    <>
      {VIEW === 0 && (
        <div className="flex flex-col h-screen justify-center gap-10">
          <div className="bg-blue-500 tarjeta animate-jump-in">
            Hola!!
            <br />
            Soy yo de nuevo, el chico de ingenieria haciendo uso de las
            habilidades que adquiri durante mi estudio, para hacer este detalle.
          </div>

          <div className="bg-amber-700 tarjeta animate-jump-in animate-delay-[1500ms]">
            Estoy muy feliz sabes, hace 1 mes desde que estamos juntos y creeme
            que ha sido tan genial pasarlo contigo.
            <br />
            <br />
            Es por ello me he tomado el tiempo para crear el siguiente
            minijuego, se llama!!!!! 🥁🥁🥁🥁🥁
            <div
              className={`ml-auto mt-5 cursor-pointer animate-fade-down animate-delay-[4000ms] w-fit`}
            >
              <p
                className="flex items-center gap-2 border px-2 rounded bg-white text-black"
                onClick={() => {
                  setVIEW(VIEW + 1);
                  setGAME_STARTED(true);
                  setGAME_INSTRUCTIONS(true);
                  btnA.play();
                }}
              >
                Como se llama? <FaAnglesRight />
              </p>
            </div>
          </div>
        </div>
      )}
      {GAME_STARTED && (
        <>
          <div className="bg-gray-900 text-5xl fixed top-10 lg:left-[40%] lg:w-96 w-fit left-14 flex gap-2 rounded-xl px-5 py-2 justify-center animate-shake animate-infinite animate-alternate-reverse animate-duration-[5000ms]">
            <p className="text-blue-400 animate-jump-in animate-delay-300">
              ONE
            </p>
            <p className="text-white animate-jump-in animate-delay-500">to</p>
            <p className="text-purple-500 animate-jump-in animate-delay-700">
              FiVe
            </p>
          </div>
          {GAME_INSTRUCTIONS ? (
            <div className="bg-light-green-600 tarjeta mt-40 lg:mt-[10%] animate-jump-in">
              Instrucciones
              <br />
              A continuacion apareceran distintas preguntas, de las cuales
              tendras que seleccionar en una escala de 1 al 5 que tanto quieres
              realizar dicha accion.
              <br /> <br />
              Al finalizar tendras tu analisis :D
              <br />
              <br />
              <p className="animate-fade-down animate-delay-[1500ms]">LISTA?</p>
              <div
                className={`ml-auto mt-5 cursor-pointer animate-fade-down animate-delay-[2500ms] w-fit`}
              >
                <p
                  className="flex items-center gap-2 border px-2 rounded bg-white text-black"
                  onClick={() => {
                    setGAME_INSTRUCTIONS(false);
                    btnA.play();
                  }}
                >
                  LISTA!!! <FaAnglesRight />
                </p>
              </div>
            </div>
          ) : (
            <>
              {QUESTIONS[CURRENT_QUESTION]}
              {!GAME_ENDED && (
                <div className="bg-white w-fit mx-auto mt-5 rounded px-10 py-1">
                  <p>Puntuacion: {PTS}</p>
                </div>
              )}
              <div className="fixed bottom-5 right-5">
                <Button
                  onClick={toggleMute}
                  className="p-3 bg-white text-black"
                >
                  {muted ? (
                    <FaVolumeDown className="h-6 w-6" />
                  ) : (
                    <FaVolumeMute className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </>
          )}
        </>
      )}
      {GAME_STARTED && GAME_ENDED && PTS < 53041 && (
        <div className="bg-blue-gray-800 tarjeta animate-jump-in mt-40 lg:mt-[10%]">
          <p>Puntuacion Final: {PTS}</p>
          <br />
          <p>
            A que ha sido un momento de relajacion jajaja, sin embargo debes
            conseguir 53041pts para desbloquear el final del juego.
          </p>
          <img
            src={import.meta.env.BASE_URL + "/el.png"}
            alt="bidabid"
            className="w-36 rounded mx-auto py-10"
          />
          <div className="flex justify-center mt-5">
            <Button
              color="blue"
              onClick={() => {
                setVIEW(1);
                setGAME_ENDED(false);
                setCURRENT_QUESTION(0);
                setPTS(0);
                btnA.play()
              }}
            >
              Intentar otra vez
            </Button>
          </div>
        </div>
      )}
      {GAME_STARTED && GAME_ENDED && PTS >= 53041 && (
        <div className="bg-purple-600 tarjeta animate-jump-in mt-40 lg:mt-[10%]">
          <p>Puntuacion Final: {PTS}</p>
          <br />
          <p>
            Enhorabuena!!! Haz conseguido superar el juego presiona el boton
            para ver el final secreto :D
          </p>
          <img
            src={import.meta.env.BASE_URL + "/ella.png"}
            alt="bidabid"
            className="w-36 rounded mx-auto py-10"
          />
          <div className="flex justify-center mt-5">
            <Button
              color="amber"
              onClick={() => {
                handleOpen();
              }}
            >
              Final Secreto
            </Button>
          </div>
        </div>
      )}
      <Dialog open={open} handler={handleOpen} className="bg-black">
        <DialogBody>
          <div className="relative h-[58vh] lg:h-[60vh] flex items-center justify-center">
            <img
              src={import.meta.env.BASE_URL + "/us.jpg"}
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
              onClick={() => {
                handleOpen();
                setVIEW(0);
                setPTS(0);
                setGAME_STARTED(false);
                setGAME_ENDED(false);
              }}
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
