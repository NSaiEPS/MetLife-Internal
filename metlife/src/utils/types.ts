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
  stitched_video:{
    url?:string
  }
}
