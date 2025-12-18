export interface SceneType {
  scene_id: number;
  scene_number: number;
  upload_url: string | null;
  uploaded_at?: string;
  ost?: string;
}

export interface VisualContentType {
  id?: string;
  prompt?: string;
  visuals?: any[];
  [key: string]: any;
}

export interface SceneDataType {
  scene_id: string;
  scene_number: number;
  upload_url?: string | null;
  title?: string;
  scenes: SceneType[];
  stitched_video: {
    url?: string;
  };
}
export type InputType = "prompt" | "image";

export interface CharacterType {
  name: string;
  role: string;
  age: number;
  gender: string;
  skin_tone: string;
  hair: string;
  face: string;
  build: string;
  wardrobe: string;
  accessories: string;
  personality: string;
  origin: string;
  img: string;
  inputType: InputType;
}

export interface AppliedAnimation {
  entry?: string;
  exit?: string;
}

export interface VideoData {
  scene_id: string;
  ost: string;
  applied_animation?: AppliedAnimation;
  image_urls: string[];
  final_video: {
    url: string;
    [key: string]: any;
  };
  duration?: number;
  [key: string]: any;
}
