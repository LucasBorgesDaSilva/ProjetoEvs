<template>
    <footer class="footer">
        <span>Copyright <strong>EVS Consultoria Patrimonial</strong> © 2019</span>
    </footer>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style>
    .footer{
        grid-area: footer;
        background-color: #DDD;
        color: #333;

        display: flex;
        align-items: center;
        justify-content: center; 
    }
</style>