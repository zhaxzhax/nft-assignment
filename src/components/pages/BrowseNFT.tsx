import NFTMarketplaceABI from "./../../abi721.json";
import { useEthersSigner } from "./../../getSigner";
import { ethers } from "ethers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";

import UploadNFT from "../UploadNFT";
import AddMoreNFT from "../AddMoreNFT";

interface Token {
  tokenURI: string; // Add other properties as needed
}

export default function BrowseNFT() {
  const signer = useEthersSigner();
  const [nftCollections, setNftCollections] = useState<any>();

  async function getAllCollections() {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        "0xE5515F30168bb173D155Dcba4F1E26a69cf79b88",
        NFTMarketplaceABI,
        signer
      );

      const collections = await contract.getAllCollections();

      const collectionTokenURIs = await Promise.all(
        collections.map(async (collection: any) => {
          const tokens = await contract.getTokensInCollection(collection.id); 

          const tokenURIs = await Promise.all(
            tokens.map(async (token: any) => {
              const uri = await contract.tokenURI(token.tokenId);
              return {
                tokenId: token.tokenId,
                tokenURI: uri,
              };
            })
          );

          return {
            collectionId: collection.id,
            tokens: tokenURIs,
            collectionName: collection.name,
          };
        })
      );

      setNftCollections(collectionTokenURIs);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  console.log(nftCollections);
  useEffect(() => {
    getAllCollections();
  }, [signer]);

  return (
    <section className="min-h-screen bg-stone-900 text-white content-center">
      <div className="flex flex-col justify-between mx-auto w-9/12">
        <div className="flex justify-between">
          <p className="my-auto">Browse NFTs</p>
          {/* <Drawer>
            <DrawerTrigger>
              <button className="p-3 rounded-md bg-cyan-600 hover:bg-cyan-800 transition-colors">
                Add a collection
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add images you want to mint as NFTs</DrawerTitle>
                <DrawerDescription>
                  The images are first minted to NFTs and then added to a smart
                  contract
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <UploadNFT collectionLength={nftCollections?.length} />
              </DrawerFooter>
            </DrawerContent>
          </Drawer> */}
        </div>
        {/* <button onClick={() => }>Get all collections</button> */}
  

  
        <Table className="rounded p-6 bg-stone-800 mt-5 ">
          <TableCaption>Global NFT collection</TableCaption>
          <TableHeader className="text-white">
            <TableRow className="hover:bg-stone-800 border-b-stone-700">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Number of NFTs</TableHead>
              <TableHead>Preview (hover to maximize)</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nftCollections?.map((nc: any, id: number) => {
              return (
                <TableRow className="hover:bg-stone-800 border-b-stone-700 ">
                  <TableCell className="font-medium">
                    {nc?.collectionId.toString()}
                  </TableCell>
                  <TableCell>
                    <span className="flex gap-4">
                      {nc?.tokens?.slice(0, 1).map((token: any) => (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          className="rounded border"
                          width={120}
                          src={token?.tokenURI}
                        />
                      ))}
                      <p className="my-auto">{nc?.collectionName}</p>
                    </span>
                  </TableCell>
                  <TableCell>{nc?.tokens.length}</TableCell>
                  <TableCell className="flex gap-5">
                    {nc?.tokens?.slice(0, 3).map((token: any) => (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img
                        className="rounded my-auto hover:scale-[2.1] transition ease-in-out"
                        width={80}
                        src={token?.tokenURI}
                      />
                    ))}
                  </TableCell>

                  {/* <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger>
                        <button className="px-4 py-1 rounded bg-amber-600 hover:bg-amber-500 hover:scale-105 transition">
                          View entire collection
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>NFTs</DialogTitle>
                          <DialogDescription className="grid grid-cols-3 gap-4">
                            {nc?.tokens?.map((token: any) => (
                              // eslint-disable-next-line jsx-a11y/alt-text
                              <img
                                className="rounded "
                                width={500}
                                src={token?.tokenURI}
                              />
                            ))}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant={"link"}
                          className="text-white hover:scale-105 transition"
                        >
                          Add more
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Select images</DialogTitle>
                          <DialogDescription className="">
                            <AddMoreNFT collectionID={id + 1} />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell> */}
                  <TableCell className="text-center">
                    <button
                      className="px-4 py-1 rounded bg-amber-600 hover:bg-amber-500 hover:scale-105 transition"
                      onClick={() => {
                        const dialog = document.getElementById(
                          `viewCollectionDialog-${id}`
                        );
                        if (dialog instanceof HTMLDialogElement) {
                          dialog.showModal();
                        }
                      }}
                    >
                      View entire collection
                    </button>
                    <dialog
                      id={`viewCollectionDialog-${id}`}
                      className="rounded p-5"
                    >
                      <h2 className="text-lg font-semibold">NFTs</h2>
                      <div className="grid grid-cols-3 gap-4">
                        {nc.tokens.map((token: Token, index: number) => (
                          <img
                            key={index}
                            className="rounded"
                            width={500}
                            src={token.tokenURI}
                            alt={`Token image ${index}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const dialog = document.getElementById(
                            `viewCollectionDialog-${id}`
                          );
                          if (dialog instanceof HTMLDialogElement) {
                            dialog.close();
                          }
                        }}
                        className="px-4 py-1 mt-3 rounded bg-red-500 hover:bg-red-400 transition"
                      >
                        Close
                      </button>
                    </dialog>
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      className="text-white hover:scale-105 transition"
                      onClick={() => {
                        const dialog = document.getElementById(
                          `addMoreDialog-${id}`
                        );
                        if (dialog instanceof HTMLDialogElement) {
                          dialog.showModal();
                        }
                      }}
                    >
                      Add more
                    </button>
                    <dialog id={`addMoreDialog-${id}`} className="rounded p-5">
                      <h2 className="text-lg font-semibold">Select images</h2>
                      <div>
                        <AddMoreNFT collectionID={id + 1} />
                      </div>
                      <button
                        onClick={() => {
                          const dialog = document.getElementById(
                            `addMoreDialog-${id}`
                          );
                          if (dialog instanceof HTMLDialogElement) {
                            dialog.close();
                          }
                        }}
                        className="px-4 py-1 mt-3 rounded bg-red-500 hover:bg-red-400 transition"
                      >
                        Close
                      </button>
                    </dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
