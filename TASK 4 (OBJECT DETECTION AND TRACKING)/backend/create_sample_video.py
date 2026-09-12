"""
Generates a short synthetic MP4 sample video for testing video upload and tracking.
"""
import os
import cv2
import numpy as np

def generate_sample_video(output_path: str = "uploads/sample_test.mp4", num_frames: int = 150, fps: int = 25):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    width, height = 640, 480
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Two moving circles/rectangles simulating moving objects
    for i in range(num_frames):
        # Create dark background
        frame = np.full((height, width, 3), 30, dtype=np.uint8)

        # Draw grid lines for perspective
        for y in range(0, height, 40):
            cv2.line(frame, (0, y), (width, y), (45, 45, 45), 1)
        for x in range(0, width, 40):
            cv2.line(frame, (x, 0), (x, height), (45, 45, 45), 1)

        # Object 1: Moving rectangle from left to right
        x1 = 50 + int(i * 3.2)
        y1 = 160 + int(np.sin(i * 0.1) * 30)
        cv2.rectangle(frame, (x1, y1), (x1 + 90, y1 + 130), (0, 180, 240), -1)
        cv2.putText(frame, "Target A", (x1 + 5, y1 - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 240, 255), 1)

        # Object 2: Moving circle from right to left
        x2 = width - 80 - int(i * 2.8)
        y2 = 240 + int(np.cos(i * 0.08) * 40)
        cv2.circle(frame, (x2, y2), 45, (60, 220, 100), -1)
        cv2.putText(frame, "Target B", (x2 - 35, y2 - 52), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 255, 200), 1)

        # Header info
        cv2.putText(frame, f"Task 4 Sample Video Feed - Frame {i+1}/{num_frames}", (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1, cv2.LINE_AA)

        out.write(frame)

    out.release()
    print(f"Sample video created successfully at: {output_path} ({num_frames} frames, {fps} fps)")

if __name__ == "__main__":
    generate_sample_video()
