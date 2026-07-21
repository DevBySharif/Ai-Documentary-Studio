import type { Shot, Storyboard, ImageType, CameraAngle, ReuseAction, EmotionTag } from "./types.js";
import type { SemanticSegment } from "../story/types.js";

const SHOT_PURPOSE_MAP: Record<string, string> = {
  new_scene: "establish_location",
  image_reuse: "maintain_context",
  symbolic_visual: "abstract_representation",
  word_level_insert: "emphasize_concept",
  diagram: "explain_mechanism",
  close_up: "highlight_detail",
  wide_shot: "show_scale",
  motion_graphics: "visualize_transition",
};

const IMAGE_TYPE_FOR_INTENT: Record<string, ImageType> = {
  new_scene: "master_scene",
  image_reuse: "supporting_scene",
  symbolic_visual: "symbolic_visual",
  word_level_insert: "word_visual",
  diagram: "supporting_scene",
  close_up: "supporting_scene",
  wide_shot: "master_scene",
  motion_graphics: "transition_visual",
};

const CAMERA_FOR_PURPOSE: Record<string, CameraAngle> = {
  establish_location: "wide_shot",
  maintain_context: "medium_shot",
  abstract_representation: "close_up",
  emphasize_concept: "extreme_close_up",
  explain_mechanism: "close_up",
  highlight_detail: "extreme_close_up",
  show_scale: "wide_shot",
  visualize_transition: "dutch_angle",
};

export class StoryboardEngine {
  generate(
    segments: SemanticSegment[],
    scriptId: string,
    projectId: string
  ): Storyboard {
    const shots: Shot[] = [];
    let shotNumber = 0;

    for (const segment of segments) {
      const purpose = SHOT_PURPOSE_MAP[segment.visualIntent] || "maintain_context";
      const imageType = IMAGE_TYPE_FOR_INTENT[segment.visualIntent] || "supporting_scene";
      const cameraAngle = CAMERA_FOR_PURPOSE[purpose] || "medium_shot";

      const prevShot = shots[shots.length - 1];
      const reuse = prevShot !== undefined &&
        prevShot.visualMetaphor === segment.visualConcept;

      shotNumber++;

      shots.push({
        shotNumber,
        sceneIndex: segment.sceneIndex,
        purpose,
        imageType,
        cameraAngle,
        visualMetaphor: segment.visualConcept,
        reuse,
        reuseSourceShot: reuse ? prevShot!.shotNumber : undefined,
        reuseAction: reuse ? this.reuseActionForIndex(shotNumber) : "new",
        estimatedDuration: segment.totalDuration,
        concept: segment.visualConcept,
        emotion: segment.sentences[0]?.emotion || "calm",
      });
    }

    const totalDuration = shots.reduce((t, s) => t + s.estimatedDuration, 0);

    return {
      id: `storyboard_${Date.now()}`,
      scriptId,
      projectId,
      shots,
      totalDuration: Math.round(totalDuration * 10) / 10,
      approved: false,
      createdAt: new Date().toISOString(),
    };
  }

  private reuseActionForIndex(index: number): ReuseAction {
    const actions: ReuseAction[] = ["reuse", "zoom_in", "pan", "motion", "lighting_shift", "crop"];
    return actions[index % actions.length];
  }
}
