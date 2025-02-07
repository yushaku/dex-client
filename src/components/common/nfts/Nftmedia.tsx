type Props = React.VideoHTMLAttributes<HTMLVideoElement> & {
  url: string
  isOn: boolean
}

export const Nftmedia = ({ url, isOn }: Props) => {
  const type = url?.split('.')?.at(-1)

  if (!url || !type) return <span />

  switch (type) {
    case 'mp4':
      return (
        <video
          className="animate size-full group-hover:scale-110"
          src={url}
          autoPlay={isOn}
          loop={isOn}
          muted={isOn}
        />
      )

    case 'gif':
    case 'webp':
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'svg':
    default:
      return (
        <img
          className="animate size-full group-hover:scale-110"
          loading="lazy"
          src={url}
        />
      )
  }
}

// <video
//   className="animate group-hover:scale-110"
//   src={`${GATEWAY_URL}${item.url}`}
//   width="100%"
// />
