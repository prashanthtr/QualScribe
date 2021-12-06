
'use strict';

async function asyncRecognizeGCS() {

    // gcsUri,
    // encoding,
    // sampleRateHertz,
    // languageCode


    // [START speech_transcribe_async_gcs]
    // Imports the Google Cloud client library

    const speech = require('@google-cloud/speech');

    //  var gAuthClient = googleAuth({
    //   	apiKey: 'AIzaSyAZ7LVkD-ejgjWq59kwweZ65iRuUPuQmok'
    //  });

	  // const client = new speech.SpeechClient({
	  //   projectId: 'speech-transcription',
	  //   auth: gAuthClient
	  // });

    // Creates a client
    const client = new speech.SpeechClient();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const gcsUri = 'gs://qualitative_transcription_bucket/intro_wav_mono.wav';
    const encoding = 'LINEAR16';
    const sampleRateHertz = 44100;
    const languageCode = 'en-US';

    //automatically get the sampleRate of the file using audioAPI

    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        enableWordTimeOffsets: true,
        model: "video",
        maxAlternatives: 3
    };

    const audio = {
        uri: gcsUri,
    };

    const request = {
        config: config,
        audio: audio,
    };

    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();

    var transcribe = response.results
        .filter(function(result){
            return result.alternatives[0].words.length > 0
    });

    var transcription = transcribe.map(function(result,ind, arr){
        //if( ind < arr.length-1){
            return format(result.alternatives[1].words[0].startTime.seconds) + "\n" + result.alternatives[1].transcript
        //}
        // else{
        //     return "[" + result.alternatives[0].words[0].startTime.seconds + "-" + result.alternatives[0].words[result.alternatives[0].words.length-1].endTime.seconds  + "]" + result.alternatives[0].transcript 
        // } 
    }).join("\n");     
        //+ "-" + result.alternatives[0].words[result.alternatives[0].words.length-1].endTime.seconds + "] " + result.alternatives[0].transcript + " \n" 
    console.log(transcription);

    //     .join('\n');
    // console.log(`Transcription: ${transcription}`);

    // [END speech_transcribe_async_gcs]
}

//convert seconds to 00:00:00
function format(seconds){

    var hrs = Math.floor(seconds/3600);
    var min = Math.floor( (seconds - hrs*3600) /60);
    var secs = seconds - hrs*3600 - min*60;
    var str  = "" + (hrs>10?hrs:("0"+hrs)) + ":" + (min>10?min:("0"+min)) + ":" + (secs>10?secs:("0"+secs))
    return str;
}

asyncRecognizeGCS().catch(console.error);
