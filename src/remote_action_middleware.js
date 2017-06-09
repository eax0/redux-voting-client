// при срабатывании action'ов с {remote: true} на клиенте, уведомляем об этом сервер через сокет
export default socket => store => next => action => {
    if (action.meta && action.meta.remote) {
        socket.emit('action', action);
    }

    return next(action);
}