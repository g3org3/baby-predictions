import PocketBase from 'pocketbase'

export const pb = new PocketBase('https://pb.jagc.app')
pb.autoCancellation(false)
