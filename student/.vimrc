filetype plugin indent on
syntax enable

" be more vim, less vi
set nocompatible

" better searching!
set incsearch
set ignorecase
set hlsearch

" spaces!
set expandtab
set shiftwidth=4
set softtabstop=4
set tabstop=8

" save
nnoremap <C-s> :w<CR>

" clear highlight by pressing enter
nnoremap <CR> :noh<CR><CR>

" from :help ins-completion
function! CleverTab()
   if strpart( getline('.'), 0, col('.')-1 ) =~ '^\s*$'
      return "\<Tab>"
   else
      return "\<C-N>"
   endif
endfunction
inoremap <Tab> <C-R>=CleverTab()<CR>

