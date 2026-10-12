# Original story media

`overview.svg` is an original neutral interface illustration. `sample.mp4` is an original silent eight-second animation of three horizontal bands; `sample.vtt` describes it. These development fixtures use the package's neutral palette and are covered by the repository MIT license. They are bundled into Storybook and used by browser tests, and are not part of the published library. Consumers supply their own media and captions.

Regenerate the clip with a local FFmpeg installation:

```sh
ffmpeg -f lavfi -i 'color=c=0x0f1114:s=480x270:r=12:d=8' -vf 'drawbox=x=40:y=55:w=400:h=32:color=0xb7c0cb:t=fill,drawbox=x=40:y=119:w=310:h=32:color=0x9ba5b1:t=fill,drawbox=x=40:y=183:w=220:h=32:color=0x687584:t=fill,fade=t=in:st=0:d=1,fade=t=out:st=7:d=1' -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart -y stories/assets/sample.mp4
```
