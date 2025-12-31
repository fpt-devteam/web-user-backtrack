// // src/components/chat/conversation-list.tsx
// import { useGetConversations } from '@/hooks/use-chat';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Skeleton } from '@/components/ui/skeleton';
// import { cn } from '@/lib/utils';
// import { formatDistanceToNow } from 'date-fns';

// interface ConversationListProps {
//   readonly selectedId?: string;
//   readonly onSelect: (id: string) => void;
// }

// export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
//   const { data, isLoading, error } = useGetConversations();
//   const conversations = data?.pages.flatMap((page) => page.items) ?? [];

//   if (isLoading) {
//     return (
//       <div className="p-4 space-y-3">
//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="flex items-center gap-3">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-3 w-32" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-center text-destructive">
//         Failed to load conversations
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className="flex-1">
//       <div className="p-2">
//         {conversations.map((conversation) => (
//           <button
//             key={conversation.id}
//             onClick={() => onSelect(conversation.id)}
//             className={cn(
//               'w-full p-3 rounded-lg text-left transition-colors',
//               'hover:bg-muted/50',
//               selectedId === conversation.id && 'bg-muted'
//             )}
//           >
//             <div className="flex items-center gap-3">
//               <Avatar>
//                 <AvatarFallback>
//                   {conversation.participants[0]?.charAt(0).toUpperCase() || '?'}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium truncate">
//                   {conversation.participants.join(', ')}
//                 </p>
//                 {conversation.lastMessage && (
//                   <p className="text-sm text-muted-foreground truncate">
//                     {conversation.lastMessage.content}
//                   </p>
//                 )}
//               </div>
//               <span className="text-xs text-muted-foreground">
//                 {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
//               </span>
//             </div>
//           </button>
//         ))}
//       </div>
//     </ScrollArea>
//   );
// }