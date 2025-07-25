'use client';

import { useState } from 'react';
import { YouTubeEmbed } from '@next/third-parties/google'
import { LuPlay } from 'react-icons/lu';

interface VideoInfo {
    id: string;
    title: string;
    description: string;
    video: {
        url: string;
        provider: string;
        providerUid: string;
        privacyHash?: string;
    }
}

export default function Videos({ videos }: { videos: VideoInfo[] }) {
    const [videoId, setVideoId] = useState<string>(videos[0].video.providerUid);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-5">
            <div className="md:col-span-3">
                <YouTubeEmbed videoid={videoId} params="controls=0&playsinline=1&cc_load_policy=1&modestbranding=1&rel=0" />
            </div>
            <div className="flex flex-col">
                {/* <div className="flex flex-row justify-between p-4 border-b-2 border-gray-200">
                    <div>Playlist</div>
                    <div>{videos.length} videos</div>
                </div> */}
                <div className="flex flex-col justify-between gap-2">
                    <ul className="list bg-base-100 border border-neutral-200 text-left">
                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played videos this week</li>
                        {videos.map((info) => (
                            <li key={info.video.providerUid} className="list-row">
                                <div><img className="size-10 rounded-box object-cover" alt={`Video ${info.description}`} loading="lazy" fetchPriority="low" src={`https://i3.ytimg.com/vi/${info.video.providerUid}/maxresdefault.jpg`} /></div>
                                <div className="list-col-grow overflow-hidden">
                                    <div className="truncate">{info.title}</div>
                                    <div className="text-xs uppercase font-semibold opacity-60">{info.description}</div>
                                </div>
                                <button className="btn btn-square btn-ghost" onClick={() => setVideoId(info.video.providerUid)}>
                                    <LuPlay />
                                </button>
                            </li>
                        ))}
                    </ul>
                    {/* {videos.map((info, index) => (
                        <div key={index} className="flex flex-row items-center gap-3 cursor-pointer" onClick={() => setVideoId(info.id)}>
                            <div className="basis-1/4">
                                <img
                                    className="pointer-events-none"
                                    width={300}
                                    height={169}
                                    src={`https://i3.ytimg.com/vi/${info.id}/maxresdefault.jpg`}
                                    alt={info.name}
                                />
                            </div>
                            <div className="basis-3/4 text-left text-ellipsis overflow-hidden whitespace-nowrap">
                                {info.name}
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
}