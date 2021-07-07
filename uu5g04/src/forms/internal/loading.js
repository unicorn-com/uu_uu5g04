/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

const Loading = (props) => {
  return (
    <span className={props.className}>
      <svg width="24" height="24" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs key="defs">
          <linearGradient key="gradient1" id={"gradient1_" + props.id} x1="0" y1="0" x2="1" y2="1">
            <stop key="stop1" offset="0%" stopColor="rgba(0, 0, 0, 0)" />
            <stop key="stop2" offset="100%" stopColor="rgba(0, 0, 0, 0.33)" />
          </linearGradient>
          <linearGradient key="gradient2" id={"gradient2_" + props.id} x1="1" y1="0" x2="0" y2="1">
            <stop key="stop1" offset="0%" stopColor="rgba(0, 0, 0, 0.33)" />
            <stop key="stop2" offset="100%" stopColor="rgba(0, 0, 0, 0.66)" />
          </linearGradient>
          <linearGradient key="gradient3" id={"gradient3_" + props.id} x1="1" y1="1" x2="0" y2="0">
            <stop key="stop1" offset="0%" stopColor="rgba(0, 0, 0, 0.66)" />
            <stop key="stop2" offset="100%" stopColor="rgba(0, 0, 0, 1)" />
          </linearGradient>
        </defs>
        <path
          key="path1"
          d="M50 10 a40 40 0 0 1 40 40"
          fill="none"
          stroke={
            (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
              ? `url(${location.href.replace(/#.*/, "")}`
              : `url(`) + `${"#gradient1_" + props.id})`
          }
          strokeWidth="20"
        />
        <path
          key="path2"
          d="M90 50 a40 40 0 0 1 -40 40"
          fill="none"
          stroke={
            (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
              ? `url(${location.href.replace(/#.*/, "")}`
              : `url(`) + `${"#gradient2_" + props.id})`
          }
          strokeWidth="20"
        />
        <path
          key="path3"
          d="M50 90 a40 40 0 0 1 -40 -40"
          fill="none"
          stroke={
            (navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome/")
              ? `url(${location.href.replace(/#.*/, "")}`
              : `url(`) + `${"#gradient3_" + props.id})`
          }
          strokeWidth="20"
        />
      </svg>
    </span>
  );
};

export default Loading;
