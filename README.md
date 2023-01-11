# JS-Audio-Trimmer

## Description:

A smiple way to trim audio files using nothing but pure Javascript and Typescript.
The project uses vanilla TS so you can implement it in your favorite framework.

![Screen-shot-1](https://i.ibb.co/p3KF3kN/js-audio-trimmer-1.png)

**Note:**

1. The current implementation allows you to trim .wav file type, but you can do it with any other audio type you want, you just need to change the encoder, here I used wav encoder, check [audio-encoder](https://www.npmjs.com/package/audio-encoder) package for more encoders. note that you can upload mp3 files but they will be converted to wav.
2. The current implementation won't get the sample rate correct because of API limitations, see [Stackoverflow](https://stackoverflow.com/questions/33428990/determining-the-sample-rate-of-a-large-audio-file-in-javascript) and [Github](https://github.com/WebAudio/web-audio-api/issues/30) for workarounds.
3. In servcies, there is a way to trim audio files based on a link, see [services.ts](https://github.com/AhmadHddad/js-audio-trimmer/blob/main/src/common/services.ts) for more info.
