<template>
    <div class ="comment-container">
        <div class = "comment-body">
            {{comment_text}}
        </div>
        <div class = "comment-footer">
            {{author}} - {{date_published}}
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            comment_text: String,
            author: String,
            date_published: String
        }
    }
</script>