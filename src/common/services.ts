import { encodeWav } from './encoders';

export async function getAudioDurationFromSrcOrFile(
  src: string | File
): Promise<number> {
  const audio = new Audio();

  const audioSrc =
    typeof src === 'string' ? src : window.URL.createObjectURL(src);

  audio.src = audioSrc;

  return new Promise((res) => {
    audio.addEventListener('loadedmetadata', function () {
      res(audio.duration);
    });
  });
}

export async function trimWavAudioFile({
  startTime,
  endTime,
  file,
  trimmedFileName = 'trimmed_audio_file.wav',
  fileType,
}: {
  startTime: number;
  endTime: number;
  file: File;
  trimmedFileName?: string;
  fileType: string;
}): Promise<File> {
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);
  return new Promise((res, rej) => {
    reader.addEventListener('load', (e) => {
      if (!e?.target) return;

      const buffer = e.target.result as ArrayBuffer;
      return trimArrayBuffer({
        buffer,
        startTime,
        endTime,
        fileType,
        trimmedFileName,
      })
        .then(res)
        .catch(rej);
    });
  });
}

function trimArrayBuffer({
  buffer,
  startTime,
  endTime,
  trimmedFileName,
  fileType = 'audio/wav',
}: {
  buffer: ArrayBuffer;
  startTime: number;
  endTime: number;
  trimmedFileName: string;
  fileType: string;
}): Promise<File> {
  return new Promise((res, rej) => {
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(
      buffer,
      function (decodedBuffer) {
        const sampleRate = decodedBuffer.sampleRate;
        const length = Math.floor((endTime - startTime) * sampleRate);
        const newBuffer = audioContext.createBuffer(
          decodedBuffer.numberOfChannels,
          length,
          sampleRate
        );
        for (
          let channel = 0;
          channel < decodedBuffer.numberOfChannels;
          channel++
        ) {
          const data = new Float32Array(length);
          decodedBuffer.copyFromChannel(data, channel, startTime * sampleRate);
          newBuffer.copyToChannel(data, channel);
        }

        encodeWav(newBuffer, (blob: Blob) => {
          res(
            new File([blob], trimmedFileName, {
              type: fileType,
            })
          );
        });
      },
      function (e) {
        rej(e);
        console.error(e);
      }
    );
  });
}

export async function trimWavAudioSrc({
  startTime,
  endTime,
  fileType,
  audioFileSrc,
  trimmedFileName = 'trimmed_audio_file.wav',
}: {
  startTime: number;
  endTime: number;
  fileType: string;
  audioFileSrc: string;
  trimmedFileName?: string;
}): Promise<File> {
  const request = new XMLHttpRequest();
  request.open('GET', audioFileSrc, true);
  request.responseType = 'arraybuffer';

  return new Promise((res, rej) => {
    request.onload = function () {
      return trimArrayBuffer({
        buffer: request.response,
        startTime,
        endTime,
        trimmedFileName,
        fileType,
      })
        .then(res)
        .catch(rej);
    };
    request.send();
  });
}
