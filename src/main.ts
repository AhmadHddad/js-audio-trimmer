import './style.css';

import Card from './components/card';
import {
  getAudioDurationFromSrcOrFile,
  trimWavAudioFile,
} from './common/services';
import { toHHMMSS } from './common/utils';
const allowedFileTypes = ['audio/wav', 'audio/mpeg'];

const Form = `<form id="form"  style="height:100%;display:flex; flex-wrap:wrap; align-content:center;; justify-content:center;">
<div class="form-group">
<span>Start at</span>
<input class="form-field" required min="0" value="0" name="start" type="number"/>
</div>
<div class="form-group" style="padding-left:4px">
<span>End at</span>
<input class="form-field" required value="30" min="3" name="end" type="number" />
</div>
<div style="padding-top:16px" >
<p style="padding-bottom:8px">
Select Audio File</p>
<input id="file-input"  required name="file" type="file" accept=".wav, .mp3"/>
<br/>
<label id="duration-label"  style="display:none; font-size:smaller;">
</label>
<div
<div id="submit-div" style="padding-top:8px;">
<button class="button" style=" background-color=gray;" type="submit">
Submit</button>
<br/>
<label id="form-submit-error-msg" style="display:none; color:red; font-size:smaller;">
Please select a vaild audio file first!</label>
</div>
</form>`;

const Container = `<div>
<h1 style="padding-block:16px;font-size:24px"> JS Audio Trimmer</h1>
<hr style="color:#8080802b;margin-bottom:16px "/>
${Form} </div>`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="height:400px; width:400px;">
  ${Card(Container)}
  </div>
`;

const formEl = document.getElementById('form');
const fileInputEl = document.getElementById('file-input');
const duratoinLabelEl = document.getElementById('duration-label');
const errorMsgObj = {
  formErrMsgEl: document.getElementById('form-submit-error-msg'),
  show: function (msg?: string) {
    console.log('SHOW', this.formErrMsgEl);
    if (!this.formErrMsgEl) return;
    if (msg?.length) this.formErrMsgEl.innerText = msg;

    this.formErrMsgEl!.style.display = 'block';
  },
  hide: function () {
    if (!this.formErrMsgEl) return;
    this.formErrMsgEl!.style.display = 'none';
  },
};

fileInputEl?.addEventListener('change', async (e) => {
  const files = e.target.files as File[];

  if (!files.length) return errorMsgObj.show();

  const file = files[0];
  const fileType = file.type;
  const isValidFileType = allowedFileTypes.indexOf(fileType) !== -1;

  if (!isValidFileType) return errorMsgObj.show();

  const duration = await getAudioDurationFromSrcOrFile(file);

  if (duration && duratoinLabelEl) {
    duratoinLabelEl.innerText = `Duration: ${toHHMMSS(duration)}`;
    duratoinLabelEl.style.display = 'block';
  }
});

formEl?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsgObj.hide();

  const start = (e.target!.start as HTMLInputElement)!.value;
  const end = (e.target!.end as HTMLInputElement)!.value;
  const files = e.target.file.files as File[];

  if (!files.length) return errorMsgObj.show();
  const file = files[0];
  const fileType = file.type;
  const isValidFileType = allowedFileTypes.indexOf(fileType) !== -1;
  if (!isValidFileType) return errorMsgObj.show();
  console.log(fileType);

  const trimmedFileName =
    prompt('What to you want to name the trimmed file?') ||
    'trimmed_audio_file.wav';

  try {
    const trimmedFile = await trimWavAudioFile({
      file,
      startTime: Number(start),
      endTime: Number(end),
      trimmedFileName,
      fileType,
    });

    const element = document.createElement('a');
    element.href = window.URL.createObjectURL(trimmedFile);
    element.click();
  } catch (e) {
    alert(JSON.stringify(e));
  }
});
