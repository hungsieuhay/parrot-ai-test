import { useAnswer } from '@/provider/answer-provider';
import { formatDurationMs, formatTime } from '@/utils/time';
import { Mic, Pause, Play, Square } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/provider/toast-provider';

interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
}

const CLOUDINARY_CLOUD_NAME = 'dgkrchato';
const CLOUDINARY_UPLOAD_PRESET = 'my-upload-preset';

export const Recoreder = ({
  isSubmitSuccessful,
}: {
  isSubmitSuccessful: boolean;
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const { addToast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setUploadUrl } = useAnswer();

  useEffect(() => {
    if (isSubmitSuccessful) {
      setRecording(null);
    }
  }, [isSubmitSuccessful]);

  const uploadToCloudinary = async (audioBlob: Blob) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('resource_type', 'video');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setUploadUrl(
        `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_mp3,q_50/${data.public_id}.mp3`
      );
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      addToast(`${uploadError}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: 'audio/webm;codecs=opus',
        });
        const url = URL.createObjectURL(blob);
        const duration = Date.now() - startTimeRef.current;

        const newRecording: AudioRecording = {
          blob,
          url,
          duration,
          timestamp: new Date(),
        };

        setRecording(newRecording);
        uploadToCloudinary(blob);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      startTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setCurrentTime(Date.now() - startTimeRef.current);
      }, 100);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setCurrentTime(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const playRecording = useCallback(() => {
    if (!recording) return;

    if (isPlaying) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      // Start playback
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(recording.url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, recording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Cleanup blob URLs
      if (recording) {
        URL.revokeObjectURL(recording.url);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex w-full items-center space-x-2 rounded-lg bg-red-500 px-6 py-4 text-lg text-white shadow-md transition-colors duration-200 hover:bg-red-600"
          >
            <Mic size={20} />
            <span>Start recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex w-full items-center space-x-2 rounded-lg bg-gray-600 px-6 py-4 text-lg text-white shadow-md transition-colors duration-200 hover:bg-gray-700"
          >
            <Square size={20} />
            <span>Stop Recording</span>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                <span className="font-mono text-xl text-red-600">
                  {formatDurationMs(currentTime)}
                </span>
              </div>
            </div>
          </button>
        )}
      </div>

      {recording && (
        <div className="bg-int mt-3 space-y-3">
          <div className="bg-input flex items-center justify-between rounded-lg border p-4">
            {isUploading ? (
              <div className="text-center text-white">
                Waiting for upload recording...
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={playRecording}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className="text-left">
                  <div className="font-medium text-white">Recording</div>
                  <div className="text-sm text-gray-100">
                    {formatTime(recording.timestamp)} •{' '}
                    {formatDurationMs(recording.duration)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
