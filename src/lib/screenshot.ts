let mediaRecorder: MediaRecorder | undefined = undefined;
let recordedChunks: BlobPart[] = [];

export async function startRecording(): Promise<void> {
    const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    if (!mediaRecorder) {
        throw new Error("Error al iniciar la grabación");
    }

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob: Blob = new Blob(recordedChunks, { type: "video/webm" });
        const url: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement("a");

        a.href = url;
        a.download = "screen-recording.webm";
        a.click();

        URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
}

/**
 * Detiene la grabación de pantalla
 * 
 * @returns
 */
export function stopRecording(): void {
    if (!mediaRecorder) {
        return;
    }

    if (mediaRecorder.state != "inactive") {
        return;
    }

    mediaRecorder.stop();
}
