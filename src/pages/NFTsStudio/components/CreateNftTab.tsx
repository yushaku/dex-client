import { Button } from '@/components/common/Button'
import Tilt from 'react-parallax-tilt'
import { PUBLIC_NFTS_ADDRESS, cn } from '@/utils'
import { TrashIcon } from '@heroicons/react/16/solid'
import { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAccount, useWriteContract } from 'wagmi'
import { NFT_MINTABLE_ABI } from '@/abi/mintableNft'
import { isAddress } from 'viem'

type Inputs = {
  name: number
  description: string
}

type Props = { collectionAddress?: string }

export const CreateNftTab = ({
  collectionAddress = PUBLIC_NFTS_ADDRESS
}: Props) => {
  const [media, setMedia] = useState<File | null>()
  const { address: userAddress } = useAccount()

  const [properties, setProperties] = useState<
    Array<{ [type: string]: string }>
  >([])
  const { isPending, writeContractAsync } = useWriteContract()
  const [property, setProperty] = useState({ trait: '', value: '' })

  const {
    register,
    getValues,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm<Inputs>()

  async function onSubmit(data: Inputs) {
    const { name, description } = data

    if (isAddress(collectionAddress)) {
      writeContractAsync({
        address: collectionAddress,
        abi: NFT_MINTABLE_ABI,
        functionName: 'mintTo',
        args: [userAddress, '']
      })
    }

    console.log({
      name,
      description,
      media,
      properties
    })
  }

  useEffect(() => {
    setFocus('name')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-10 flex gap-10">
      <form
        className="mt-5 flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Name"
          required
          className={cn(
            'w-full rounded-lg border-2 border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-none',
            { 'border-red-400': errors.name?.message }
          )}
          {...register('name', { required: true })}
        />

        <input
          type="file"
          placeholder="file"
          onChange={(e) => {
            setMedia(e.target.files?.[0])
          }}
          className={cn(
            'w-full rounded-lg border-2 border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-none'
          )}
        />

        <textarea
          rows={5}
          placeholder="description"
          className={cn(
            'w-full rounded-lg border-2 border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-none',
            { 'border-red-400': errors.description?.message }
          )}
          {...register('description', { required: true })}
        />

        <h3 className="text-xl">Properties</h3>
        {properties.map((prop) => {
          return (
            <label className="flex gap-3">
              <span className="flex-1 rounded-lg bg-focus p-3">
                {prop.trait}
              </span>
              <span className="flex-1 rounded-lg bg-focus p-3">
                {prop.value}
              </span>
              <span className="col-span-1 flex gap-3 rounded-lg bg-focus p-3 hover:bg-red-500">
                <TrashIcon className="size-5" />
              </span>
            </label>
          )
        })}

        <label className="flex gap-3">
          <input
            value={property.trait}
            onChange={(e) =>
              setProperty({ ...property, trait: e.target.value })
            }
            placeholder="trait"
            className="w-full rounded-lg border-2 border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-none"
          />
          <input
            value={property.value}
            onChange={(e) =>
              setProperty({ ...property, value: e.target.value })
            }
            placeholder="value"
            className="w-full rounded-lg border-2 border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-none"
          />
          <Button
            onClick={() => {
              if (property.trait && property.value) {
                setProperties([...properties, property])
                setProperty({ trait: '', value: '' })
              }
            }}
            title="+"
            className="w-fit"
          />
        </label>

        <Button title="Create" type="submit" disabled={isPending} />
      </form>

      <div className="flex-center flex-1">
        <Tilt
          tiltMaxAngleX={5}
          tiltMaxAngleY={10}
          glareEnable
          glareMaxOpacity={0.5}
          scale={1.2}
          perspective={500}
          className="parallax-effect"
        >
          <article className="h-fit w-[300px] cursor-grab rounded-lg bg-layer p-6 hover:shadow">
            <div className="inner-img">{media && <Media media={media} />}</div>
            <h3 className="inner-text mt-5 text-xl font-bold">
              {getValues('name')}
            </h3>
          </article>
        </Tilt>
      </div>
    </div>
  )
}

const Media = memo(function ({ media }: { media: File | null }) {
  if (media?.type === 'video/mp4') {
    return (
      <video
        src={URL.createObjectURL(media)}
        className="w-full rounded-lg"
        autoPlay
        loop
        muted
      />
    )
  }

  if (media?.size) {
    return (
      <img
        src={URL.createObjectURL(media) ?? '/logo.png'}
        className="w-full rounded-lg"
      />
    )
  }

  return <img src={'/logo.png'} className="w-full rounded-lg" />
})
