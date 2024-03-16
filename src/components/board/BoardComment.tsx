import dateUtil from "../../utils/dateUtils";
import {memo, useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {ContextStore} from "../../router/AppRouter";
import {FiCornerLeftUp} from "react-icons/fi";
import StringUtils from "../../utils/StringUtils";

const REPLY_MAXIMUM = 5;
function BoardComment(boardComment:BoardCommentProps){
    const [editable,setEditable] = useState(false);
    const fetch = useFetch();
    const {modal} = useContext(ContextStore);
    const [replyMode, setReplyMode] = useState(false);
    const [replyComment,setReplyComment] = useState<BoardCommentProps>({
        num: 1,
        content: '',
        boardNum: boardComment.boardNum,
        deep: boardComment.deep + 1,
        parentNum: boardComment.num,
        hashes: []
    });
    const [comments, setComments] = useState<BoardCommentProps[]>([]);
    const [comment,setComment] = useState<BoardCommentProps>(boardComment);

    const {num, parentNum,changed,created, content, email} = comment;
    const isModified = created !== changed;
    const targetDate = isModified ? changed : created;
    const { years, months, days, hours, minutes } = dateUtil.parseDate(targetDate);
    let formattedDate = `${years}년 ${months}월 ${days}일 ${hours}시 ${minutes}분`;
    if(isModified){
        formattedDate += ' (수정됨)';
    }
    const fetchReply = async () => {
        const result = await fetch.get(`/api/v1/board/comment/reply/${num}`);
        setComments(result.data);
    }
    useEffect(()=> {
        fetchReply();
    },[])
    const toggleEditable = () => {
        setEditable(!editable);
    }
    const toggleReplyMode = () => {
        setReplyMode(!replyMode);
    }

    const handleSubmitReply = async () => {
        if(replyComment.deep >= REPLY_MAXIMUM){
            modal.setAuto('댓글 제한','더 이상 대댓글은 달 수 없어요.');
            return;
        }
        const result = await fetch.post('/api/v1/board/comment/insert',replyComment);
        fetch.resultHandler(result,() => {
            fetchReply();
            if(replyMode){
                setReplyMode(false);
            }
        });
    }
    const handlePatch = async ()=> {
        const result = await fetch.patch<BoardCommentProps>(`/api/v1/board/comment/update`,comment);
        fetch.resultHandler(result, () => toggleEditable());
    }
    const handleDelete = async () => {
        modal.confirm('댓글 삭제', '댓글을 정말로 삭제할까요?', async () => {
            const result = await fetch.$delete(`/api/v1/board/comment/delete/${num}`);
            fetch.resultHandler(result, () => {
                modal.setAuto(result.modal.title, result.modal.content);
            });
        });
    }
    return (
        <div className="p-4 my-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    {editable ?
                        <input
                        type="text"
                        value={content}
                        onChange={(e)=>{
                            setComment(prev => ({
                                ...prev,
                                content: e.target.value
                            }))
                        }}
                        className={`text-sm py-2 px-3 bg-gray-50 text-gray-700 mb-2 focus:ring-2 focus:ring-blue-300`}
                        // editable이 false일 경우 focus 비활성화
                        tabIndex={1}
                    />
                        :
                        <div className='flex text-xs text-red-500'>
                            {boardComment.deep > 1 ? <FiCornerLeftUp/> : <></>}
                            <div className={`text-sm py-2 px-3 bg-gray-50 text-gray-700 mb-2 focus:ring-2 focus:ring-blue-300`} dangerouslySetInnerHTML={{__html: content}}></div>
                        </div>
                    }
                </div>
                <div className="flex flex-shrink-0 space-x-2">
                    {editable ?
                        <button onClick={handlePatch} className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                            완료
                        </button> :
                        <button onClick={toggleEditable} className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                            수정
                        </button>}
                    <button onClick={handleDelete} className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50">
                        삭제
                    </button>
                    <button onClick={() => {
                        toggleReplyMode();
                        fetchReply();
                    }} className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50">
                        댓글 달기
                    </button>
                </div>
            </div>

            {replyMode && (
                <div className="mt-4">
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={replyComment.content}
                        onChange={e => {
                            setReplyComment(prev => ({
                                ...prev,
                                content: e.target.value
                            }))
                        }}
                        rows={3}
                    ></textarea>
                    <button
                        onClick={handleSubmitReply}
                        className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    >
                        답변 등록
                    </button>
                </div>
            )}
            <div className="text-xs font-medium text-gray-500 mt-2">
                {email} {formattedDate}
            </div>
            {comments.map((comment) => {
                return <BoardComment key={StringUtils.generateRandomHash(4)} {...comment} />
            })}
        </div>
    )
}
export default memo(BoardComment);
